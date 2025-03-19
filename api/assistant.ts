import "dotenv/config";
import { eventHandler, createSlackClient, createAgentRegistry } from "../lib";
import { createAssistantAgent } from "../agents/assistant";
import { createSearchAgent } from "./search";

const slack = createSlackClient(process.env.SLACK_BOT_TOKEN);

export async function POST(request: Request) {
  console.log("AI request received");

  const registry = createAgentRegistry([createSearchAgent()]);

  const agent = createAssistantAgent({
    availableAgents: registry.getAvailableAgents(),
  });
  const payload = await request.text().then(JSON.parse);
  return eventHandler(slack, agent, payload);
}
