// Backend/src/routes/gemini.route.js

import express from 'express'; // <--- CHANGE: Use import
import { GoogleGenerativeAI } from "@google/generative-ai"; // <--- CHANGE: Use import

const router = express.Router();

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the route: POST /enhance-summary
router.post('/enhance-summary', async (req, res) => {
    try {
        const { summary } = req.body;

        if (!summary || summary.trim().length === 0) {
            return res.status(400).json({ error: 'Summary text is required.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // <-- This is the correct line
        const prompt = `You are a professional resume writer. Rewrite and enhance the following professional summary to be more impactful and concise, highlighting key skills and achievements. The summary is: "${summary}"`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedText = response.text();

        res.json({ enhancedSummary: enhancedText });

    } catch (error) {
        console.error("Error with Gemini API:", error);
        res.status(500).json({ error: "Failed to enhance summary due to a server error." });
    }
});

export default router; // <--- CHANGE: Use export default