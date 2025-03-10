import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

generateText({
  model: openai("gpt-4o"),
  system: `You are a Slack bot assistant Keep your responses concise and to the point.
    - Do not tag users.
    - Current date is: ${new Date().toISOString().split("T")[0]}
    - Make sure to ALWAYS include sources in your final response if you use web search. Put sources inline if possible.`,
  prompt: "What is the capital of France?",
}).then(({ text }) => {
  console.log(text);
});
