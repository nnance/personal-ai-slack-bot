import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText, tool } from "ai";
import { z } from "zod";

const model = openai("gpt-4o");

const system = `You are a Slack bot assistant Keep your responses concise and to the point.
- Do not tag users.
- Current date is: ${new Date().toISOString().split("T")[0]}
- Make sure to ALWAYS include sources in your final response if you use web search. Put sources inline if possible.`;

export const generateResponse = async (message: string) => {
  const { text } = await generateText({
    model,
    system,
    prompt: message,
    maxSteps: 10,
  });
  return text;
};

export const generateChatResponse = async (
  messages: CoreMessage[],
  content: string
) => {
  const { text } = await generateText({
    model,
    system,
    messages: [...messages, { role: "user", content }],
  });
  return text;
};
