import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { SlackAgent, SlackClient } from "../lib";
import { createInviteToChannel, createSendMessage } from "./tools";
import { CoreMessage, generateText } from "ai";

interface AssistantAgentProps {
  client: SlackClient;
  availableAgents: string[];
}

const createSystemPrompt = (
  availableAgents: string[],
  existingAgents?: string[]
) => `
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

export function createAssistantAgent({
  client,
  availableAgents,
}: AssistantAgentProps) {
  const name = "Assistant";
  const handle = "AI";

  const agent: SlackAgent = {
    name,
    description: "A Slack bot assistant to help users in a Slack channel",
    handle,
    generateResponse: async ({ channel, content, messages }) => {
      const message: CoreMessage = { role: "user", content };
      const existingAgents = await client
        .getAgentsInChannel(channel)
        .then((agents) => agents.map((agent) => agent.name || ""));

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: createSystemPrompt(availableAgents, existingAgents),
        messages: messages ? [...messages, message] : [message],
        maxSteps: 10,
        tools: {
          inviteToChannel: createInviteToChannel(client, channel),
          sendMessage: createSendMessage(client, channel),
        },
      });
      return text;
    },
  };

  return agent;
}
