import { slackToCoreMessage } from "./adapters";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";

describe("slackToCoreMessage", () => {
  const botUserId = "B12345";

  it("transforms bot messages correctly", () => {
    const messages: MessageElement[] = [
      { bot_id: "B12345", text: "Hello from the bot!" },
    ];

    const result = slackToCoreMessage(botUserId, messages);

    expect(result).toEqual([
      { role: "assistant", content: "Hello from the bot!" },
    ]);
  });

  it("transforms user messages correctly", () => {
    const messages: MessageElement[] = [
      { user: "U67890", text: "Hello from the user!" },
    ];

    const result = slackToCoreMessage(botUserId, messages);

    expect(result).toEqual([{ role: "user", content: "Hello from the user!" }]);
  });

  it("filters out messages with no text", () => {
    const messages: MessageElement[] = [
      { bot_id: "B12345", text: undefined },
      { user: "U67890", text: undefined },
      { user: "U67890", text: "" },
    ];

    const result = slackToCoreMessage(botUserId, messages);

    expect(result).toEqual([]);
  });

  it("handles mixed messages correctly", () => {
    const messages: MessageElement[] = [
      { bot_id: "B12345", text: "Bot message" },
      { user: "U67890", text: "User message" },
      { bot_id: "B12345", text: undefined },
      { user: "U67890", text: undefined },
    ];

    const result = slackToCoreMessage(botUserId, messages);

    expect(result).toEqual([
      { role: "assistant", content: "Bot message" },
      { role: "user", content: "User message" },
    ]);
  });

  it("returns an empty array when input is empty", () => {
    const messages: MessageElement[] = [];

    const result = slackToCoreMessage(botUserId, messages);

    expect(result).toEqual([]);
  });
});
