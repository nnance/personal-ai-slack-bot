import "dotenv/config";
import { eventHandler, createSlackClient, createAgentRegistry } from "../lib";
import { createAssistantAgent, createSearchAgent } from "../agents";
import { createResearcherAgent } from "../agents/researcher";

const client = createSlackClient(process.env.SLACK_BOT_TOKEN);

export async function POST(request: Request) {
  console.log("AI request received");

  const registry = createAgentRegistry([
    createSearchAgent(),
    createResearcherAgent(),
  ]);

  const agent = createAssistantAgent({
    client,
    availableAgents: registry.getAvailableAgents(),
  });
  const payload = await request.text().then(JSON.parse);
  return eventHandler(client, agent, payload);
}
