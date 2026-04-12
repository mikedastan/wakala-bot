const express = require('express');
const app = express();

app.use(express.json());

// Health check (important for Render)
app.get('/', (req, res) => {
  res.status(200).send('Bot is running 🚀');
});

app.post('/webhook', (req, res) => {
  console.log('Incoming:', req.body);
  res.status(200).send('OK');
});

// IMPORTANT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
