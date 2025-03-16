import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";
import { CoreMessage } from "ai";

export const slackToCoreMessage = (
  botUserId: string,
  messages: MessageElement[]
): CoreMessage[] => {
  const result = messages
    .map((message) => {
      const isBot = !!message.bot_id && message.bot_id === botUserId;
      if (!message.text) return null;

      return {
        role: isBot ? "assistant" : "user",
        content: message.text,
      } as CoreMessage;
    })
    .filter((msg): msg is CoreMessage => msg !== null);

  return result;
};
