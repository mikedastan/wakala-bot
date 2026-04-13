const express = require('express');
const app = express();

app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

// Webhook (FINAL WORKING VERSION)
app.post('/webhook', (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body, null, 2));

  const sender = req.body?.key?.remoteJid || "";
  const cleanSender = sender.split("@")[0];

  console.log("Detected sender:", cleanSender);

  const OFFICE_NUMBER = "255755459575";

  if (!cleanSender.includes(OFFICE_NUMBER)) {
    console.log("Blocked user:", cleanSender);
    return res.send("Unauthorized");
  }

  console.log("Authorized message from office");

  res.send("Report received ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
