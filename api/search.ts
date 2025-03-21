import "dotenv/config";
import { eventHandler, createSlackClient } from "../lib";
import { createSearchAgent } from "../agents";

const slack = createSlackClient(process.env.SEARCH_AGENT_TOKEN);

export async function POST(request: Request) {
  console.log("Search request received");

  const agent = createSearchAgent();
  const payload = await request.text().then(JSON.parse);
  return eventHandler(slack, agent, payload);
}
