import { eventHandler } from "../lib/handlers";
import { createSlackClient } from "../lib/slack";

const slack = createSlackClient(process.env.SEARCH_AGENT_TOKEN);
const requestHandler = eventHandler(slack);

export async function POST(request: Request) {
  console.log("Search request received");
  return requestHandler(request);
}
