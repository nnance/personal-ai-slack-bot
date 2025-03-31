import "dotenv/config";
import { generateObject, generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { SlackAgent } from "../lib";

const basePrompt = (
  TYPE_OF_PERSON: string,
  CONVERSATION_TRANSCRIPT: string
) => `
You are a memory agent for a personal assistant AI that supports a ${TYPE_OF_PERSON}. Your primary task is to identify and extract preferences from chat conversations. These preferences will be used to better understand and serve the executive in future interactions.

Here is the transcript of a recent conversation with the executive:

<conversation_transcript>
${CONVERSATION_TRANSCRIPT}
</conversation_transcript>

Carefully analyze the conversation transcript above. Your goal is to identify any stated or implied preferences of the ${TYPE_OF_PERSON}. These preferences can relate to various aspects of their personal or professional life, such as:

- Work habits (e.g., preferred meeting times, communication methods)
- Travel preferences (e.g., airline choices, hotel amenities)
- Food and dining preferences
- Technology preferences (e.g., preferred devices, software)
- Personal interests and hobbies
- Time management preferences
- Communication style preferences

`;

const sentinelPrompt = `
When you receive a message, you perform a sequence of steps consisting of:

1. Analyze the message for information.
2. If it has any information worth recording, return TRUE. If not, return FALSE.
3. Include a confidence score between 0 and 1, where 1 is the highest confidence.

Take a deep breath, think step by step, and then analyze the following message:
`;

const sentinelResultSchema = z.object({
  containsInformation: z.boolean(),
  confidence: z.number(),
});

export const sentinelCheck = async (message: string) =>
  generateObject({
    model: anthropic("claude-3-5-haiku-latest"),
    system: basePrompt("CEO", message) + sentinelPrompt,
    prompt: message,
    schema: sentinelResultSchema,
  }).then(({ object }) => object);

const extractionPrompt = `
When you identify a preference, extract it and provide a brief explanation of why you believe it is a preference. If you're unsure about a preference or if there seems to be conflicting information, note this uncertainty.

Format your findings as follows:

<preference>
Category: [Category of the preference]
Preference: [Concise statement of the preference]
Explanation: [Brief explanation of why this is considered a preference, including any relevant quotes from the transcript]
Confidence: [High/Medium/Low]
</preference>

Repeat this format for each preference you identify. If you don't find any clear preferences in a particular category, you don't need to include it.

Begin your analysis now. Start with "<analysis>" and end with "</analysis>".`;

const extractionResultSchema = z.array(
  z.object({
    category: z.string(),
    preference: z.string(),
    explanation: z.string(),
    confidence: z.string(),
  })
);

export const memoryExtraction = async (message: string) =>
  generateObject({
    model: anthropic("claude-3-5-haiku-latest"),
    system: basePrompt("CEO", message) + extractionPrompt,
    prompt: message,
    schema: extractionResultSchema,
  }).then(({ object }) => object);

export function createMemoryExtractionAgent() {
  const agent: SlackAgent = {
    name: "Memory Extraction Agent",
    description:
      "Use this agent to extract preferences from chat conversations.  It is best used to identify and record preferences of the person you are assisting.",
    handle: "researcher-agent",
    generateResponse: async ({ content }) => {
      const { containsInformation } = await sentinelCheck(content);
      if (containsInformation) {
        const preferences = await memoryExtraction(content);
        return JSON.stringify(preferences, null, 2);
      }
      return "No preferences found in the conversation.";
    },
  };
  return agent;
}
