import { createAssistantAgent } from "./assistant";
import { SlackClient } from "../lib";

import * as tools from "./tools";
import { tool } from "ai";
import { z } from "zod";

describe("createAssistantAgent", () => {
  var inviteToChannel: any;
  var sendMessage: any;
  var slackClient: SlackClient;

  beforeEach(() => {
    inviteToChannel = jest.fn(async () => ({ success: true }));
    sendMessage = jest.fn(async () => ({ success: true }));
    slackClient = {
      getBotId: jest.fn(),
      getAssistant: jest.fn(),
      removeBotMention: jest.fn(),
      removeAllBotMentions: jest.fn(),
      convertToSlackMarkdown: jest.fn(),
      getThread: jest.fn(),
      getHistory: jest.fn(),
      sendMessage: jest.fn(),
    };

    jest
      .spyOn(tools, "createInviteToChannel")
      .mockImplementation((channel: string) =>
        tool({
          description:
            "Invite a Slack bot agent to a channel to help with a specific task",
          parameters: z.object({
            name: z.string(),
          }),
          execute: inviteToChannel,
        })
      );
    jest
      .spyOn(tools, "createSendMessage")
      .mockImplementation((client: SlackClient, channel: string) =>
        tool({
          description:
            "Send a Slack message to an agent in a channel to perform a specific task",
          parameters: z.object({
            name: z.string(),
            message: z.string(),
          }),
          execute: sendMessage,
        })
      );
  });

  describe("createAssistantAgent", () => {
    it("initializes the model and system correctly", () => {
      const agent = createAssistantAgent({
        client: slackClient,
        availableAgents: [],
      });
      expect(agent).not.toBeUndefined();
    });

    it("sets up tools correctly", async () => {
      const channel = "test-channel";
      const thread = "test-thread";

      const agent = createAssistantAgent({
        client: slackClient,
        availableAgents: [],
      });
      await agent.generateResponse({ channel, content: "Test" });

      expect(tools.createInviteToChannel).toHaveBeenCalledWith(channel);
      expect(tools.createSendMessage).toHaveBeenCalledWith(
        slackClient,
        channel
      );
    });
  });

  describe("when there are available agents", () => {
    it("should add the agent to the channel and send it a message", async () => {
      const agent = createAssistantAgent({
        client: slackClient,
        availableAgents: [
          "Search Agent: @search-agent - Use this agent to search the web for information.",
        ],
      });
      const mockInput = {
        channel: "test",
        content:
          "We will be traveling to Portland, OR this week.   Are there any events happening related to art or food this week?",
      };

      const response = await agent.generateResponse(mockInput);

      expect(inviteToChannel).toHaveBeenCalled();
      expect(sendMessage).toHaveBeenCalled();
    }, 10000);
  });

  describe("when agents are already in the channel", () => {
    it("should not add the agent but send it a message", async () => {
      const agent = createAssistantAgent({
        client: slackClient,
        availableAgents: [
          "Search Agent: @search-agent - Use this agent to search the web for information.",
        ],
        existingAgents: ["@search-agent"],
      });
      const mockInput = {
        channel: "test",
        content:
          "We will be traveling to Portland, OR this week.   Are there any events happening related to art or food this week?",
      };

      const response = await agent.generateResponse(mockInput);

      expect(inviteToChannel).not.toHaveBeenCalled();
      expect(sendMessage).toHaveBeenCalled();
    }, 10000);
  });
});
