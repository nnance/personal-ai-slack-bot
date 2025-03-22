import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { SlackAgent } from "../lib";
import { searchWeb } from "./tools";
import { generateText } from "ai";

export function createSearchAgent() {
  const system = `
  You are a Slack bot assistant Your role is to provide research and information to users in a Slack channel.
  You should provide accurate and up-to-date information leveraging the web search tools available to you. 

- Current date is: ${new Date().toISOString().split("T")[0]}
- You should not repond to users directly, but perform the search  
- Make sure to ALWAYS include sources in your final response if you use web search. Put sources inline if possible.
`;

  const agent: SlackAgent = {
    name: "Search Agent",
    description: "Use this agent to search the web for information.",
    handle: "search-agent",
    generateResponse: async ({ content: prompt }) => {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system,
        prompt,
        maxSteps: 10,
        tools: {
          searchWeb: searchWeb(),
        },
      });
      return text;
    },
  };
  return agent;
}
