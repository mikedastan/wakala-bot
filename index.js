const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";
const SESSION_ID = "77337";
const ALLOWED_NUMBER = "255755459575";
const GROUP_ID = "120363407884587277@g.us";
const SESSIONS_FILE = "/tmp/sessions.json";

const FLOAT_FIELDS = [
  { key: "mpesa",     label: "M-PESA" },
  { key: "tigo",      label: "TIGO PESA" },
  { key: "airtel",    label: "AIRTEL MONEY" },
  { key: "halotel",   label: "HALOTEL" },
  { key: "selcom",    label: "SELCOM" },
  { key: "tigolipa",  label: "TIGO LIPA" },
  { key: "airtelipa", label: "AIRTEL LIPA" },
  { key: "vodalipa",  label: "VODA LIPA" },
  { key: "nmb",       label: "NMB BANK" },
  { key: "crdb",      label: "CRDB BANK" },
  { key: "cash",      label: "CASH" }
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

function loadSessions() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
    }
  } catch (e) {}
  return {};
}

function saveSessions(sessions) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions), "utf8");
  } catch (e) {}
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

async function handleMessage(senderJid, messageText) {
  const sessions = loadSessions();
  if (!sessions[senderJid]) sessions[senderJid] = { step: "idle", data: {} };
  const session = sessions[senderJid];
  const text = messageText.trim();
  const textLower = text.toLowerCase();

  // Always allow RIPOTI to restart
  if (textLower === "ripoti") {
    sessions[senderJid] = { step: "name", data: {} };
    saveSessions(sessions);
    await sendMessage(senderJid,
      "Habari! 👋 Tuanze ripoti ya shift.\n\n" +
      "Jina lako ni nani?\n*(Alfany / Alex)*"
    );
    return;
  }

  // Lipa fee checker — works anytime
  if (textLower.startsWith("lipa ")) {
    const amt = parseInt(text.replace(/lipa/i,"").replace(/,/g,"").trim());
    if (!isNaN(amt)) {
      const tier = getFee(amt);
      if (tier) {
        await sendMessage(senderJid,
          `💰 *Lipa Namba Fee*\n\nKiasi: ${fmt(amt)}\nFee yako: *${fmt(tier.fee)}*`
        );
      } else {
        await sendMessage(senderJid, "Kiasi hicho hakipo kwenye mfumo. Tuma kati ya TZS 1,000 - 3,000,000.");
      }
    }
    return;
  }

  // IDLE — show menu
  if (session.step === "idle") {
    await sendMessage(senderJid,
      "Habari! 👋 *Wakala Sinza Bot*\n\n" +
      "Tumia amri hizi:\n" +
      "*RIPOTI* - Kutuma ripoti ya shift\n" +
      "*LIPA 50000* - Angalia fee ya lipa namba\n" +
      "*USAIDIZI* - Msaada"
    );
    return;
  }

  // NAME step
  if (session.step === "name") {
    if (!["alfany","alex"].includes(textLower)) {
      await sendMessage(senderJid, "Tafadhali andika jina lako:\n*Alfany* au *Alex*");
      return;
    }
    session.data.name = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    session.step = "float_0";
    saveSessions(sessions);
    await sendMessage(senderJid,
      `Sawa ${session.data.name}! 💪\n\n` +
      `Tupe salio la *${FLOAT_FIELDS[0].label}* (TZS)\n` +
      `_(Andika 0 kama hakuna)_`
    );
    return;
  }

  // FLOAT steps
  if (session.step.startsWith("float_")) {
    const idx = parseInt(session.step.split("_")[1]);
    const val = parseFloat(text.replace(/,/g,"")) || 0;
    session.data[FLOAT_FIELDS[idx].key] = val;

    if (idx + 1 < FLOAT_FIELDS.length) {
      session.step = `float_${idx + 1}`;
      saveSessions(sessions);
      await sendMessage(senderJid,
        `✅ Sawa!\n\nSasa tupe salio la *${FLOAT_FIELDS[idx+1].label}* (TZS)\n` +
        `_(Andika 0 kama hakuna)_`
      );
    } else {
      session.step = "lipa_fees";
      saveSessions(sessions);
      await sendMessage(senderJid,
        "✅ Vizuri sana! Float zote zimesajiliwa.\n\n" +
        "Sasa tupe *huduma za lipa namba* ulizokusanya shift hii.\n\n" +
        "Andika kama hivi:\n`voda 1500, tigo 1500, airtel 1000`\n\n" +
        "Au andika *hapana* kama hakuna."
      );
    }
    return;
  }

  // LIPA FEES step
  if (session.step === "lipa_fees") {
    session.data.lipaFees = 0;
    session.data.lipaDetails = "";
    if (textLower !== "hapana") {
      let total = 0;
      const details = [];
      text.split(",").forEach(p => {
        const match = p.trim().match(/(\w+)\s+([\d,]+)/);
        if (match) {
          const amt = parseInt(match[2].replace(/,/g,""));
          total += amt;
          details.push(`${match[1]}: ${fmt(amt)}`);
        }
      });
      session.data.lipaFees = total;
      session.data.lipaDetails = details.join(", ");
    }
    session.step = "expenses";
    saveSessions(sessions);
    await sendMessage(senderJid,
      "✅ Sawa!\n\nKuna *matumizi* yoyote ya shift hii?\n\n" +
      "Andika kama hivi:\n`chakula 10000, transport 5000`\n\n" +
      "Au andika *hapana* kama hakuna."
    );
    return;
  }

  // EXPENSES step
  if (session.step === "expenses") {
    session.data.expenses = 0;
    session.data.expDetails = "";
    if (textLower !== "hapana") {
      let total = 0;
      const details = [];
      text.split(",").forEach(p => {
        const match = p.trim().match(/(\w+)\s+([\d,]+)/);
        if (match) {
          const amt = parseInt(match[2].replace(/,/g,""));
          total += amt;
          details.push(`${match[1]}: ${fmt(amt)}`);
        }
      });
      session.data.expenses = total;
      session.data.expDetails = details.join(", ");
    }

    const d = session.data;
    const totalFloat = FLOAT_FIELDS.reduce((s,f) => s + (d[f.key] || 0), 0);
    const profit = d.lipaFees - d.expenses;
    const now = new Date();
    const timeStr = now.toLocaleString("en-TZ", {
      day:"2-digit", month:"short", year:"numeric",
      hour:"2-digit", minute:"2-digit",
      timeZone:"Africa/Dar_es_Salaam"
    });

    const report =
      `📊 *RIPOTI YA SHIFT - WAKALA SINZA*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Mfanyakazi: *${d.name}*\n` +
      `🕐 Wakati: ${timeStr}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *SALIO ZA FLOAT*\n` +
      FLOAT_FIELDS.map(f => `  ${f.label}: ${fmt(d[f.key]||0)}`).join("\n") + "\n" +
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

    sessions[senderJid] = { step: "idle", data: {} };
    saveSessions(sessions);

    await sendMessage(senderJid, `✅ Ripoti imekamilika! Asante ${d.name}. 🎉`);
    await sendMessage(GROUP_ID, report);
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
    if (messages?.key?.fromMe) return;

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

    const senderNumber = cleanedPn.replace("+","").trim();
    console.log("Sender:", senderNumber, "| Message:", messageBody);

    if (!senderNumber.includes(ALLOWED_NUMBER)) {
      console.log("Unauthorized:", senderNumber);
      return;
    }

    const senderJid = "+" + senderNumber;
    await handleMessage(senderJid, messageBody);

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
