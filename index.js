const express = require('express');
const app = express();

app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.status(200).send('Bot is running 🚀');
});

// Webhook
app.post('/webhook', (req, res) => {
  const sender = req.body.from || "";

  const OFFICE_NUMBER = "255755459575";

  if (!sender.includes(OFFICE_NUMBER)) {
    console.log("Blocked user:", sender);
    return res.send("Unauthorized");
  }

  console.log("Authorized message:", req.body);

  res.send("Report received ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
