import "dotenv/config";
import { WebClient } from "@slack/web-api";

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

export const getBotId = async () => {
  const { user_id: botUserId } = await client.auth.test();

  if (!botUserId) {
    throw new Error("botUserId is undefined");
  }
  return botUserId;
};

export const sendMessage = async (
  text: string,
  channel: string,
  thread_ts: string | undefined
) => {
  return client.chat.postMessage({
    channel: channel,
    thread_ts: thread_ts,
    text,
    unfurl_links: false,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      },
    ],
  });
};
