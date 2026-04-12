const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Bot is running 🚀");
});

app.post('/webhook', (req, res) => {
    console.log("Incoming message:", req.body);

    res.status(200).json({
        message: "Report received ✅"
    });
});

// VERY IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
