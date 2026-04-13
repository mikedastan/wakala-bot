const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";

app.get('/', (req, res) => {
  res.send('Wakala Sinza Bot inafanya kazi!');
});

app.post('/webhook', async (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body, null, 2));

  try {
    const message = req.body?.data?.message;

    const sender = req.body?.data?.key?.remoteJid
                || req.body?.key?.remoteJid
                || req.body?.remoteJid
                || "";

    const cleanSender = sender
      .replace("@s.whatsapp.net", "")
      .replace("@c.us", "");

    const messageText = message?.conversation
                     || message?.extendedTextMessage?.text
                     || req.body?.data?.messageBody
                     || req.body?.messageBody
                     || "";

    console.log("Sender:", cleanSender);
    console.log("Message:", messageText);

    if (!cleanSender || cleanSender.length < 5) {
      console.log("No valid sender, skipping");
      return res.send("OK");
    }

    await axios.post(
      "https://wasenderapi.com/api/send-message",
      {
        to: cleanSender + "@s.whatsapp.net",
        text: "Ujumbe umepokelewa! ✅\nWakala Sinza Bot inafanya kazi.\n\nTumia:\n*RIPOTI* - Kutuma ripoti ya shift\n*USAIDIZI* - Msaada"
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Reply sent to:", cleanSender);
    res.send("OK");

  } catch (error) {
    console.error("Error sending reply:", error.message);
    res.send("Error");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
