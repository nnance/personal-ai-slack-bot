import "dotenv/config";
import { ConversationsRepliesResponse, WebClient } from "@slack/web-api";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";

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

  async function inviteToChannel(user: string, channel: string) {
    return client.conversations.invite({
      channel: channel,
      users: user,
    });
  }

  async function getAgentsInChannel(channel: string) {
    const membersResponse = await client.conversations.members({
      channel: channel,
    });

    if (!membersResponse.members) {
      throw new Error("No members found in the channel");
    }

    const members = membersResponse.members.map(async (member) =>
      client.users.info({ user: member })
    );

    return (await Promise.all(members))
      .map((member) => ({
        id: member.user!.id,
        team_id: member.user!.team_id,
        name: member.user!.name,
        real_name: member.user!.real_name,
        bot_id: member.user!.is_bot ? member.user!.id : undefined,
      }))
      .filter((member) => !!member.bot_id);
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
    inviteToChannel,
    getAgentsInChannel,
  };
}
