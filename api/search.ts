import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { eventHandler, createSlackClient, createSlackAgent } from "../lib";

export function createSearchAgent() {
  const model = openai("gpt-4o");
  const system = `You are a Slack bot assistant Keep your responses concise and to the point.
- Do not tag users.
- Current date is: ${new Date().toISOString().split("T")[0]}
- Make sure to ALWAYS include sources in your final response if you use web search. Put sources inline if possible.`;

  return createSlackAgent({ model, system });
}

let requestHandler: ReturnType<typeof eventHandler>;

export async function POST(request: Request) {
  console.log("Search request received");

  // create and cache the request handler on the first request
  if (!requestHandler) {
    const slack = createSlackClient(process.env.SEARCH_AGENT_TOKEN);
    const agent = createSearchAgent();
    requestHandler = eventHandler(slack, agent);
  }
  return requestHandler(request);
}
