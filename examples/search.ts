import "dotenv/config";
import { createSearchAgent } from "../agents";

const agent = createSearchAgent();

agent
  .generateResponse({
    content: "What events are happening this week in Portland, OR",
    channel: "test",
  })
  .then(console.log);
