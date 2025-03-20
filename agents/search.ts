import { openai } from "@ai-sdk/openai";
import { createSlackAgent, searchWeb } from "../lib";

export function createSearchAgent() {
  const name = "Search Agent";
  const description = "Use this agent to search the web for information.";
  const handle = "@search-agent";
  const model = openai("gpt-4o");
  const system = `You are a Slack bot assistant Keep your responses concise and to the point.
- Do not tag users.
- Current date is: ${new Date().toISOString().split("T")[0]}
- Make sure to ALWAYS include sources in your final response if you use web search. Put sources inline if possible.`;

  const tools = {
    searchWeb: searchWeb(),
  };
  return createSlackAgent({ name, description, handle, model, system });
}
