const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";
const SESSION_ID = "77337";

app.get('/', (req, res) => {
  res.send('Wakala Sinza Bot inafanya kazi!');
});

app.post('/webhook', async (req, res) => {
  console.log("FULL BODY:", JSON.stringify(req.body, null, 2));
  res.send("OK");

  try {
    const messages = req.body?.data?.messages;
    if (!messages) return;

    const fromMe = messages?.key?.fromMe;
    if (fromMe) return;

    const messageBody = messages?.messageBody || "";
    if (!messageBody) return;

    const remoteJid = messages?.key?.remoteJid || "";
    let cleanedPn = messages?.key?.cleanedSenderPn || "";

    console.log("remoteJid:", remoteJid);
    console.log("cleanedPn:", cleanedPn);
    console.log("messageBody:", messageBody);

    if (!cleanedPn && remoteJid.includes("@lid")) {
      console.log("LID detected, converting to phone number...");
      try {
        const lidRes = await axios.get(
          `https://wasenderapi.com/api/contacts/get-pn-from-lid?lid=${encodeURIComponent(remoteJid)}&sessionId=${SESSION_ID}`,
          {
            headers: { Authorization: `Bearer ${API_KEY}` }
          }
        );
        cleanedPn = lidRes.data?.phoneNumber || lidRes.data?.pn || "";
        console.log("Converted LID to phone:", cleanedPn);
      } catch (lidErr) {
        console.error("LID conversion failed:", lidErr.response?.data || lidErr.message);
      }
    }

    const replyTo = cleanedPn ? "+" + cleanedPn.replace("+", "") : remoteJid;

    if (!replyTo || replyTo.length < 5) {
      console.log("No valid recipient");
      return;
    }

    console.log("Replying to:", replyTo);

    await axios.post(
      "https://wasenderapi.com/api/send-message",
      {
        to: replyTo,
        text: "Ujumbe umepokelewa! ✅\nWakala Sinza Bot inafanya kazi.\n\nTumia:\n*RIPOTI* - Kutuma ripoti ya shift\n*USAIDIZI* - Msaada"
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Reply sent to:", replyTo);

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
