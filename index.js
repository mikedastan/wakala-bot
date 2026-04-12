const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const message = req.body;

    console.log("Incoming:", message);

    res.json({
        reply: "Report received ✅"
    });
});

app.get('/', (req, res) => {
    res.send("Bot is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
