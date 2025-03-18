import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import {
  eventHandler,
  createSlackClient,
  createSlackAgent,
  createInviteToChannel,
  createSendMessage,
} from "../lib";

export function createAssistantAgent() {
  const model = openai("gpt-4o");
  const system = `
  You are a Slack bot assistant Keep your responses concise and to the point.  You role is to assist users in a Slack channel.
  Answer questions, provide information, and help users with their requests.  Respond directly when possible, but ask for clarification if needed.
  
  If you need help from a Slack bot agent, use the following tools:
  - inviteToChannel: tool to invite them to the channel
  - sendMessage: tool to send a message to the Slack bot agent
  
  Slack bot agents available to invite or direct:
  - Search Agent: @search-agent - Use this agent to search the web for information.
  
  - Current date is: ${new Date().toISOString().split("T")[0]}  
  `;
  const tools = (channel: string, thread?: string) => ({
    inviteToChannel: createInviteToChannel(channel),
    sendMessage: createSendMessage(channel),
  });
  return createSlackAgent({ model, system, tools });
}

const slack = createSlackClient(process.env.SLACK_BOT_TOKEN);

export async function POST(request: Request) {
  console.log("AI request received");

  const agent = createAssistantAgent();
  const payload = await request.text().then(JSON.parse);
  return eventHandler(slack, agent, payload);
}
