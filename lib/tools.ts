import { tool } from "ai";
import { z } from "zod";

export const createInviteToChannel = (channel: string) =>
  tool({
    description:
      "Invite a Slack bot agent to a channel to help with a specific task",
    parameters: z.object({
      name: z.string(),
    }),
    execute: async ({ name }) => {
      console.log(`Invite: ${name} to ${channel}`);
    },
  });

export const createSendMessage = (channel: string) =>
  tool({
    description:
      "Send a Slack message to an agent in a channel to perform a specific task",
    parameters: z.object({
      name: z.string(),
      message: z.string(),
    }),
    execute: async ({ name, message }) => {
      console.log(`Send: ${message} to ${name} in ${channel}`);
    },
  });
