import "dotenv/config";
import { createSlackClient } from "../lib";

const client = createSlackClient(process.env.SLACK_BOT_TOKEN);

client.getAgentsInChannel("C08HCH97PRC").then((members) => {
  console.dir(members, { depth: null });
});
