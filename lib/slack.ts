import "dotenv/config";
import { ConversationsRepliesResponse, WebClient } from "@slack/web-api";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";

// TODO: Method to get a list of existing agents in a channel

export type SlackClient = ReturnType<typeof createSlackClient>;

export function createSlackClient(slackToken?: string) {
  const client = new WebClient(slackToken);

  const getBotId = async () => {
    const { user_id: botUserId } = await client.auth.test();

    if (!botUserId) {
      throw new Error("botUserId is undefined");
    }
    return botUserId;
  };

  const getAssistant = () => client.assistant;

  const removeBotMention = (botUserId: string, text: string) =>
    text.includes(`<@${botUserId}>`)
      ? text.split(`<@${botUserId}>`)[1].trim()
      : text;

  function removeAllBotMentions(botUserId: string, messages: MessageElement[]) {
    return messages.map((message) => ({
      ...message,
      text: removeBotMention(botUserId, message.text!),
    }));
  }

  const convertToSlackMarkdown = (text: string) =>
    text.replace(/\[(.*?)\]\((.*?)\)/g, "<$2|$1>").replace(/\*\*/g, "*");

  async function getThread(
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

  async function getHistory(channel_id: string) {
    const history = await client.conversations.history({
      channel: channel_id,
      limit: 50,
    });

    // Ensure we have messages
    const { messages } = history;
    if (!messages) throw new Error("No messages found in thread");

    return history;
  }

  async function sendMessage(
    text: string,
    channel: string,
    thread_ts?: string
  ) {
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
  }

  return {
    getBotId,
    getAssistant,
    removeBotMention,
    removeAllBotMentions,
    convertToSlackMarkdown,
    getThread,
    getHistory,
    sendMessage,
  };
}
