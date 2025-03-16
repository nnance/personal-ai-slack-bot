import "dotenv/config";
import { ConversationsRepliesResponse, WebClient } from "@slack/web-api";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";

export const client = new WebClient(process.env.SLACK_BOT_TOKEN);

export const getBotId = async () => {
  const { user_id: botUserId } = await client.auth.test();

  if (!botUserId) {
    throw new Error("botUserId is undefined");
  }
  return botUserId;
};

export const removeBotMention = (botUserId: string, text: string) =>
  text.includes(`<@${botUserId}>`)
    ? text.split(`<@${botUserId}>`)[1].trim()
    : text;

export const removeAllBotMentions = (
  botUserId: string,
  messages: MessageElement[]
) =>
  messages.map((message) => ({
    ...message,
    text: removeBotMention(botUserId, message.text!),
  }));

export const convertToSlackMarkdown = (text: string) =>
  text.replace(/\[(.*?)\]\((.*?)\)/g, "<$2|$1>").replace(/\*\*/g, "*");

export async function getThread(
  channel_id: string,
  thread_ts: string
): Promise<ConversationsRepliesResponse> {
  const replies = await client.conversations.replies({
    channel: channel_id,
    ts: thread_ts,
    limit: 50,
  });

  // Ensure we have messages
  const { messages } = replies;
  if (!messages) throw new Error("No messages found in thread");

  return replies;
}

export async function getHistory(channel_id: string) {
  const history = await client.conversations.history({
    channel: channel_id,
    limit: 50,
  });

  // Ensure we have messages
  const { messages } = history;
  if (!messages) throw new Error("No messages found in thread");

  return history;
}

export const sendMessage = async (
  text: string,
  channel: string,
  thread_ts?: string
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
