const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";
const OFFICE_NUMBER = "255755459575";

app.get('/', (req, res) => {
  res.send('Wakala Sinza Bot is running!');
});

app.post('/webhook', async (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body, null, 2));
  try {
    const message = req.body?.data?.message;
    const sender = req.body?.data?.key?.remoteJid || "";
    const cleanSender = sender.replace("@s.whatsapp.net", "").replace("@c.us", "");
    const messageText = message?.conversation || message?.extendedTextMessage?.text || "";

    console.log("Sender:", cleanSender);
    console.log("Message:", messageText);

    if (!cleanSender.includes(OFFICE_NUMBER)) {
      console.log("Blocked:", cleanSender);
      return res.send("Unauthorized");
    }

    console.log("Authorized message from office");

    await axios.post(
      "https://wasenderapi.com/api/send-message",
      {
        to: cleanSender + "@s.whatsapp.net",
        text: "Ujumbe umepokelewa! ✅\n\nKaribuni Wakala Sinza Bot.\nTumia:\n*RIPOTI* - Kutuma ripoti ya shift\n*USAIDIZI* - Msaada"
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.send("OK");
  } catch (error) {
    console.error("Error:", error.message);
    res.send("Error");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
