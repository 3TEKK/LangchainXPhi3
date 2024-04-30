import express from "express";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const app = express();
const port = 3001;

// Initialize output parser
const outputParser = new StringOutputParser();

// Define chat prompt template
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a professional interviewer, based on the user input answer the questions and do not give further explanations. Make the questions human format. Get the questions only, no further text. Avoid providing additional explanations; simply answer the question"],
    ["user", "{input}"],
]);

// Initialize chat model
const chatModel = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "phi3",
});

// Middleware to parse JSON request body
app.use(express.json());

// Define endpoint for handling questions
app.post("/ask", async (req, res) => {
    try {
        // Extract the question from the request body
        const { question } = req.body;
        
        // Check if question exists
        if (!question) {
            return res.status(400).json({ error: "Question parameter is required" });
        }

        // Invoke the chat model with the question
        const response = await prompt.pipe(chatModel).pipe(outputParser).invoke({
            input: question.toString(), // Convert to string to ensure consistency
        });

        // Send the response back to the client
        res.json({ answer: response });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
