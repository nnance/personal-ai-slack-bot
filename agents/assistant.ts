import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { createSlackAgent, SlackClient } from "../lib";
import { createInviteToChannel, createSendMessage } from "./tools";

interface AssistantAgentProps {
  client: SlackClient;
  availableAgents: string[];
  existingAgents?: string[];
  channel?: string;
  thread?: string;
}

// TODO: Implement Slack Agent interface with AI SDK

export function createAssistantAgent({
  client,
  availableAgents,
  existingAgents,
}: AssistantAgentProps) {
  const name = "Assistant";
  const description = "A Slack bot assistant to help users in a Slack channel";
  const handle = "AI";
  const model = openai("gpt-4o");
  const system = `
  You are a Slack bot assistant Keep your responses concise and to the point.  You role is to assist users in a Slack channel.
  Answer questions, provide information, and help users with their requests.  Respond directly when possible, but ask for clarification if needed.
  
  - Do not tag users.

  If you need help from a Slack bot agent, use the following tools:
  - inviteToChannel: tool to invite them to the channel
  - sendMessage: tool to send a message to the Slack bot agent.  When using these tools, make sure to mention the bot and provide clear instructions
  
  Slack bot agents available to invite or direct:
  ${availableAgents.map((agent) => `- ${agent}`).join("\n")}

  If a Slack bot agent is already in the channel, you can ask them for help directly.
  ${existingAgents ? `Slack bot agents already in the channel: ${existingAgents.join(", ")}` : ""}

  - Current date is: ${new Date().toISOString().split("T")[0]}  
  `;
  const tools = (channel: string, thread?: string) => ({
    inviteToChannel: createInviteToChannel(client, channel),
    sendMessage: createSendMessage(client, channel),
  });

  return createSlackAgent({ name, description, handle, model, system, tools });
}
