import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { eventHandler, createSlackClient, inviteToChannel } from "../lib";
import { createSlackAgent } from "../lib/ai";
import { sendMessage } from "../lib/tools";

export function createAssistantAgent() {
  const model = openai("gpt-4o");
  const system = `
  You are a Slack bot assistant Keep your responses concise and to the point.  You role is to assist users in a Slack channel.
  Answer questions, provide information, and help users with their requests.  Respond directly when possible, but ask for clarification if needed.
  
  If you need help from a Slack bot agent, use the following tools:
  - inviteToChannel: tool to invite them to the channel
  - sendMessage: tool to tell the Slack bot agent what to do
  
  Slack bot agents available to invite and direct includes:
  - Search Agent: @search-agent - Use this agent to search the web for information.
  
  - Current date is: ${new Date().toISOString().split("T")[0]}
  `;
  const tools = { inviteToChannel, sendMessage };
  return createSlackAgent({ model, system, tools });
}

let requestHandler: ReturnType<typeof eventHandler>;

export async function POST(request: Request) {
  console.log("AI request received");

  // create and cache the request handler on the first request
  if (!requestHandler) {
    const slack = createSlackClient(process.env.SLACK_BOT_TOKEN);
    const agent = createAssistantAgent();
    requestHandler = eventHandler(slack, agent);
  }
  return requestHandler(request);
}
