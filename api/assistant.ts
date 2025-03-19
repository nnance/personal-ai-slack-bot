import "dotenv/config";
import { eventHandler, createSlackClient } from "../lib";
import { createAssistantAgent } from "../agents/assistant";

const slack = createSlackClient(process.env.SLACK_BOT_TOKEN);

export async function POST(request: Request) {
  console.log("AI request received");

  const agent = createAssistantAgent({
    availableAgents: [
      "Search Agent: @search-agent - Use this agent to search the web for information.",
    ],
  });
  const payload = await request.text().then(JSON.parse);
  return eventHandler(slack, agent, payload);
}
