import { eventHandler } from "../lib/handlers";
import { createSlackClient } from "../lib/slack";

const slack = createSlackClient(process.env.SLACK_BOT_TOKEN);
const requestHandler = eventHandler(slack);

export async function POST(request: Request) {
  console.log("AI request received");
  return requestHandler(request);
}
