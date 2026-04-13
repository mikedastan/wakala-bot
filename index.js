const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const API_KEY = "f0c0ba6116ce04b22d411011a8de95228032f339d8e64a09cd8a5b43f072c921";
const INVITE_CODE = "JnERqGR3r7U7SjG2PacmYn";

app.get('/', async (req, res) => {
  res.send('Wakala Sinza Bot inafanya kazi!');
});

app.get('/getgroup', async (req, res) => {
  try {
    const response = await axios.get(
      `https://wasenderapi.com/api/groups/invite/${INVITE_CODE}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` }
      }
    );
    console.log("GROUP INFO:", JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.json({ error: error.response?.data || error.message });
  }
});

app.post('/webhook', async (req, res) => {
  console.log("FULL BODY:", JSON.stringify(req.body, null, 2));
  res.send("OK");

  try {
    const messages = req.body?.data?.messages;
    if (!messages) return;
    const fromMe = messages?.key?.fromMe;
    if (fromMe) return;
    const remoteJid = messages?.key?.remoteJid || "";
    const messageBody = messages?.messageBody || "";
    console.log("remoteJid:", remoteJid);
    console.log("messageBody:", messageBody);
    console.log("isGroup:", remoteJid.includes("@g.us"));
  } catch (error) {
    console.error("Error:", error.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
