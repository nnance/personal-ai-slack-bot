import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText, tool } from "ai";
import { z } from "zod";

export const generateResponse = async (message: string) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a Slack bot assistant Keep your responses concise and to the point.
    - Do not tag users.
    - Current date is: ${new Date().toISOString().split("T")[0]}
    - Make sure to ALWAYS include sources in your final response if you use web search. Put sources inline if possible.`,
    prompt: message,
    maxSteps: 10,
  });
  return text;
};
