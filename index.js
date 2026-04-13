const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 🔑 PUT YOUR WASENDER API KEY HERE
const API_KEY = "PASTE_YOUR_API_KEY_HERE";

// Home route
app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

// Webhook
app.post('/webhook', async (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body, null, 2));

  try {
    const sender = req.body?.key?.remoteJid || "";
    const cleanSender = sender.split("@")[0];

    console.log("Detected sender:", cleanSender);

    const OFFICE_NUMBER = "255755459575";

    if (!cleanSender.includes(OFFICE_NUMBER)) {
      console.log("Blocked user:", cleanSender);
      return res.send("Unauthorized");
    }

    console.log("Authorized message from office");

    // 🔥 SEND REPLY BACK TO WHATSAPP
    await axios.post(
      "https://wasenderapi.com/api/send-message",
      {
        to: cleanSender,
        text: "Report received ✅"
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
