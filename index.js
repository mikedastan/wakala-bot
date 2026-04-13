const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";
const SESSION_ID = "77337";
const ALLOWED_NUMBER = "255755459575";
const GROUP_ID = "120363407884587277@g.us";

const sessions = {};

const FLOAT_FIELDS = [
  { key: "mpesa",      label: "M-PESA" },
  { key: "tigo",       label: "TIGO PESA" },
  { key: "airtel",     label: "AIRTEL MONEY" },
  { key: "halotel",    label: "HALOTEL" },
  { key: "selcom",     label: "SELCOM" },
  { key: "tigolipa",   label: "TIGO LIPA" },
  { key: "airtelipa",  label: "AIRTEL LIPA" },
  { key: "vodalipa",   label: "VODA LIPA" },
  { key: "nmb",        label: "NMB BANK" },
  { key: "crdb",       label: "CRDB BANK" },
  { key: "cash",       label: "CASH" }
];

const TIERS = [
  {min:1000,max:1999,fee:100},{min:2000,max:2999,fee:200},{min:3000,max:3999,fee:200},
  {min:4000,max:4999,fee:300},{min:5000,max:5999,fee:300},{min:6000,max:6999,fee:400},
  {min:7000,max:7999,fee:400},{min:8000,max:8999,fee:400},{min:9000,max:9999,fee:400},
  {min:10000,max:14999,fee:500},{min:15000,max:19999,fee:500},{min:20000,max:29999,fee:500},
  {min:30000,max:39999,fee:700},{min:40000,max:49999,fee:1000},{min:50000,max:99999,fee:1000},
  {min:100000,max:199999,fee:1500},{min:200000,max:299999,fee:1500},{min:300000,max:399999,fee:2000},
  {min:400000,max:499999,fee:2000},{min:500000,max:599999,fee:2500},{min:600000,max:699999,fee:2500},
  {min:700000,max:799999,fee:2500},{min:800000,max:899999,fee:3000},{min:900000,max:999999,fee:3000},
  {min:1000000,max:3000000,fee:3000}
];

function getFee(amt) {
  return TIERS.find(t => amt >= t.min && amt <= t.max) || null;
}

function fmt(n) {
  return "TZS " + Math.round(n).toLocaleString();
}

async function sendMessage(to, text) {
  try {
    await axios.post(
      "https://wasenderapi.com/api/send-message",
      { to, text },
      { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
    );
    console.log("Sent to:", to);
  } catch (err) {
    console.error("Send error:", err.response?.data || err.message);
  }
}

async function handleRipoti(senderJid, messageText, session) {
  const text = messageText.trim();

  if (!session || session.step === "idle") {
    if (text.toLowerCase() === "ripoti") {
      sessions[senderJid] = { step: "name", data: {} };
      await sendMessage(senderJid, "Habari! 👋 Tuanze ripoti ya shift.\n\nJina lako ni nani?\n*(Alfany / Alex)*");
      return;
    }

    if (text.toLowerCase().startsWith("lipa ")) {
      const amt = parseInt(text.replace(/lipa/i, "").replace(/,/g, "").trim());
      if (!isNaN(amt)) {
        const tier = getFee(amt);
        if (tier) {
          await sendMessage(senderJid, `💰 Lipa Namba Fee\n\nKiasi: ${fmt(amt)}\nFee yako: *${fmt(tier.fee)}*`);
        } else {
          await sendMessage(senderJid, "Kiasi hicho hakipo kwenye mfumo. Tuma kiasi kati ya TZS 1,000 - 3,000,000.");
        }
      }
      return;
    }

    await sendMessage(senderJid,
      "Habari! 👋 Wakala Sinza Bot\n\n" +
      "Tumia amri hizi:\n" +
      "*RIPOTI* - Kutuma ripoti ya shift\n" +
      "*LIPA 50000* - Angalia fee ya lipa namba\n" +
      "*USAIDIZI* - Msaada"
    );
    return;
  }

  if (session.step === "name") {
    const name = text.trim();
    if (!["alfany", "alex"].includes(name.toLowerCase())) {
      await sendMessage(senderJid, "Tafadhali andika jina lako sahihi:\n*Alfany* au *Alex*");
      return;
    }
    session.data.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    session.step = "float_0";
    await sendMessage(senderJid, `Sawa ${session.data.name}! 💪\n\nTupe salio la *${FLOAT_FIELDS[0].label}* (TZS)\n_(Andika 0 kama hakuna)_`);
    return;
  }

  if (session.step.startsWith("float_")) {
    const idx = parseInt(session.step.split("_")[1]);
    const val = parseFloat(text.replace(/,/g, "")) || 0;
    session.data[FLOAT_FIELDS[idx].key] = val;

    if (idx + 1 < FLOAT_FIELDS.length) {
      session.step = `float_${idx + 1}`;
      await sendMessage(senderJid, `✅ Sawa!\n\nSasa tupe salio la *${FLOAT_FIELDS[idx + 1].label}* (TZS)\n_(Andika 0 kama hakuna)_`);
    } else {
      session.step = "lipa_fees";
      await sendMessage(senderJid,
        "✅ Vizuri sana!\n\nSasa tupe *huduma za lipa namba* ulizokusanya shift hii.\n\n" +
        "Andika kama hivi:\n`voda 1500, tigo 1500, airtel 1000`\n\n" +
        "Au andika *hapana* kama hakuna."
      );
    }
    return;
  }

  if (session.step === "lipa_fees") {
    session.data.lipaFees = 0;
    session.data.lipaDetails = "";
    if (text.toLowerCase() !== "hapana") {
      let total = 0;
      const parts = text.split(",");
      const details = [];
      parts.forEach(p => {
        const match = p.trim().match(/(\w+)\s+(\d+)/);
        if (match) {
          const amt = parseInt(match[2]);
          total += amt;
          details.push(`${match[1]}: ${fmt(amt)}`);
        }
      });
      session.data.lipaFees = total;
      session.data.lipaDetails = details.join(", ");
    }
    session.step = "expenses";
    await sendMessage(senderJid,
      "✅ Sawa!\n\nKuna *matumizi* yoyote ya shift hii?\n\n" +
      "Andika kama hivi:\n`chakula 10000, transport 5000`\n\n" +
      "Au andika *hapana* kama hakuna."
    );
    return;
  }

  if (session.step === "expenses") {
    session.data.expenses = 0;
    session.data.expDetails = "";
    if (text.toLowerCase() !== "hapana") {
      let total = 0;
      const parts = text.split(",");
      const details = [];
      parts.forEach(p => {
        const match = p.trim().match(/(\w+)\s+(\d+)/);
        if (match) {
          const amt = parseInt(match[2]);
          total += amt;
          details.push(`${match[1]}: ${fmt(amt)}`);
        }
      });
      session.data.expenses = total;
      session.data.expDetails = details.join(", ");
    }

    const d = session.data;
    const totalFloat = FLOAT_FIELDS.reduce((s, f) => s + (d[f.key] || 0), 0);
    const profit = d.lipaFees - d.expenses;
    const now = new Date();
    const timeStr = now.toLocaleString("en-TZ", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: "Africa/Dar_es_Salaam"
    });

    const report =
      `📊 *RIPOTI YA SHIFT - WAKALA SINZA*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Mfanyakazi: *${d.name}*\n` +
      `🕐 Wakati: ${timeStr}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *SALIO ZA FLOAT*\n` +
      FLOAT_FIELDS.map(f => `  ${f.label}: ${fmt(d[f.key] || 0)}`).join("\n") + "\n" +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📱 *HUDUMA ZA LIPA NAMBA*\n` +
      `  ${d.lipaDetails || "Hakuna"}\n` +
      `  Jumla: *${fmt(d.lipaFees)}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🧾 *MATUMIZI*\n` +
      `  ${d.expDetails || "Hakuna"}\n` +
      `  Jumla: *${fmt(d.expenses)}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *JUMLA YA FLOAT: ${fmt(totalFloat)}*\n` +
      `📈 *FAIDA YA SHIFT: ${fmt(profit)}*\n` +
      `━━━━━━━━━━━━━━━━━━━━`;

    await sendMessage(senderJid, `✅ Ripoti imekamilika! Asante ${d.name}.\n\nInatumwa kwa Michael...`);
    await sendMessage(GROUP_ID, report);

    sessions[senderJid] = { step: "idle" };
    return;
  }
}

app.get('/', (req, res) => {
  res.send('Wakala Sinza Bot inafanya kazi!');
});

app.post('/webhook', async (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body, null, 2));
  res.send("OK");

  try {
    const messages = req.body?.data?.messages;
    if (!messages) return;

    const fromMe = messages?.key?.fromMe;
    if (fromMe) return;

    const remoteJid = messages?.key?.remoteJid || "";
    let cleanedPn = messages?.key?.cleanedSenderPn || "";
    const messageBody = messages?.messageBody || "";

    if (!messageBody) return;

    if (!cleanedPn && remoteJid.includes("@lid")) {
      try {
        const lidRes = await axios.get(
          `https://wasenderapi.com/api/contacts/get-pn-from-lid?lid=${encodeURIComponent(remoteJid)}&sessionId=${SESSION_ID}`,
          { headers: { Authorization: `Bearer ${API_KEY}` } }
        );
        cleanedPn = lidRes.data?.phoneNumber || lidRes.data?.pn || "";
      } catch (e) {
        console.error("LID error:", e.message);
      }
    }

    const senderNumber = cleanedPn.replace("+", "").trim();
    console.log("Sender:", senderNumber, "| Message:", messageBody);

    if (!senderNumber.includes(ALLOWED_NUMBER)) {
      console.log("Unauthorized:", senderNumber);
      return;
    }

    const senderJid = "+" + senderNumber;
    if (!sessions[senderJid]) sessions[senderJid] = { step: "idle" };

    await handleRipoti(senderJid, messageBody, sessions[senderJid]);

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
