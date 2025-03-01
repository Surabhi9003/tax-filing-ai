require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const { PineconeClient } = require("@pinecone-database/pinecone");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new PineconeClient();
pinecone.init({ apiKey: process.env.PINECONE_API_KEY, environment: "us-east1-gcp" });

app.post("/ask", async (req, res) => {
    try {
        const { question } = req.body;
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: question }],
        });
        res.json({ answer: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
