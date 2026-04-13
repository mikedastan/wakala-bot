const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";
const SESSION_ID = "77337";
const ALLOWED_NUMBER = "255755459575";

app.get('/', (req, res) => {
  res.send('Wakala Sinza Bot inafanya kazi!');
});

app.post('/webhook', async (req, res) => {
  console.log("=== FULL WEBHOOK BODY ===");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("=== END ===");
  res.send("OK");

  try {
    const messages = req.body?.data?.messages;
    if (!messages) { console.log("No messages"); return; }

    const fromMe = messages?.key?.fromMe;
    if (fromMe) { console.log("From me, skip"); return; }

    const remoteJid = messages?.key?.remoteJid || "";
    const cleanedPn = messages?.key?.cleanedSenderPn || "";
    const messageBody = messages?.messageBody || "";

    console.log("=== MESSAGE INFO ===");
    console.log("remoteJid:", remoteJid);
    console.log("cleanedPn:", cleanedPn);
    console.log("messageBody:", messageBody);
    console.log("isGroup:", remoteJid.includes("@g.us"));
    console.log("===================");

  } catch (error) {
    console.error("Error:", error.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
