import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";
import { CoreMessage } from "ai";

// TODO: Create a common messaging interface that can be used by both Slack and Core
// TODO: Remove slack interfaces from all Core code
// TODO: Review the Core Message interface as a possible candidate for the common messaging interface
// TODO: Implement a lightweight implementation of the common messaging interface

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
