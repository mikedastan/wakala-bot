const express = require('express');
const app = express();

app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

// Webhook
app.post('/webhook', (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body, null, 2));

  // TRY MULTIPLE POSSIBLE FIELDS (Wasender formats vary)
  const sender =
    req.body?.from ||
    req.body?.sender ||
    req.body?.phone ||
    req.body?.data?.from ||
    req.body?.data?.key?.remoteJid ||
    "";

  console.log("Detected sender:", sender);

  const OFFICE_NUMBER = "255755459575";

  // Normalize sender (remove @s.whatsapp.net if exists)
  const cleanSender = sender.replace("@s.whatsapp.net", "");

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
