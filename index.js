const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";

app.get('/', (req, res) => {
  res.send('Wakala Sinza Bot inafanya kazi!');
});

app.post('/webhook', async (req, res) => {
  console.log("FULL BODY:", JSON.stringify(req.body, null, 2));

  try {
    const body = req.body;

    const fromMe = body?.data?.messages?.key?.fromMe
                || body?.data?.key?.fromMe
                || body?.key?.fromMe
                || false;

    if (fromMe) {
      console.log("From me, skipping");
      return res.send("OK");
    }

    const messageBody = body?.data?.messages?.messageBody
                     || body?.data?.messageBody
                     || body?.messageBody
                     || "";

    const remoteJid = body?.data?.messages?.key?.remoteJid
                   || body?.data?.key?.remoteJid
                   || body?.key?.remoteJid
                   || body?.remoteJid
                   || "";

    const cleanedPn = body?.data?.messages?.key?.cleanedSenderPn
                   || body?.data?.key?.cleanedSenderPn
                   || body?.key?.cleanedSenderPn
                   || "";

    console.log("remoteJid:", remoteJid);
    console.log("cleanedPn:", cleanedPn);
    console.log("messageBody:", messageBody);

    const replyTo = remoteJid || (cleanedPn ? "+" + cleanedPn : "");

    if (!replyTo || replyTo.length < 5) {
      console.log("No valid recipient, skipping");
      return res.send("OK");
    }

    if (!messageBody) {
      console.log("No message body, skipping");
      return res.send("OK");
    }

    console.log("Sending reply to:", replyTo);

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

    console.log("Reply sent successfully to:", replyTo);
    res.send("OK");

  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    res.send("Error");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
