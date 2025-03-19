import { createAssistantAgent } from "./assistant";
import { createInviteToChannel, createSendMessage } from "../lib";
import * as lib from "../lib";
import { tool } from "ai";
import { z } from "zod";

describe("createAssistantAgent", () => {
  var inviteToChannel: any;
  var sendMessage: any;

  beforeEach(() => {
    inviteToChannel = jest.fn(async ({ name }) => ({ success: true }));
    sendMessage = jest.fn(async ({ name }) => ({ success: true }));

    jest
      .spyOn(lib, "createInviteToChannel")
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
    jest.spyOn(lib, "createSendMessage").mockImplementation((channel: string) =>
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
      const agent = createAssistantAgent({ availableAgents: [] });
      expect(agent).not.toBeUndefined();
    });

    it("sets up tools correctly", async () => {
      const channel = "test-channel";
      const thread = "test-thread";

      const agent = createAssistantAgent({ availableAgents: [] });
      await agent.generateResponse({ channel, content: "Test" });

      expect(createInviteToChannel).toHaveBeenCalledWith(channel);
      expect(createSendMessage).toHaveBeenCalledWith(channel);
    });
  });

  describe("when there are available agents", () => {
    it("should add the agent to the channel and send it a message", async () => {
      const agent = createAssistantAgent({
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
    });
  });

  describe("when agents are already in the channel", () => {
    it("should not add the agent but send it a message", async () => {
      const agent = createAssistantAgent({
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
    });
  });
});
