import "dotenv/config";
import { createSearchAgent } from "./search";
import { createSlackClient } from "../lib";

async function search() {
  const agent = createSearchAgent();
  const result = await agent.generateResponse({
    content: "What events are happening this week in Portland, OR",
    channel: "test",
  });

  console.log(result);
}

async function getMembers() {
  const client = createSlackClient(process.env.SLACK_BOT_TOKEN);
  const members = await client.getAgentsInChannel("C08HCH97PRC");
  console.dir(members, { depth: null });
}

getMembers();
