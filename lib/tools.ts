import { tool } from "ai";
import { z } from "zod";

export const inviteToChannel = tool({
  description:
    "Invite a Slack bot agent to a channel to help with a specific task",
  parameters: z.object({
    name: z.string(),
    channel: z.string(),
  }),
  execute: async ({ name, channel }) => {
    console.log(`Invite: ${name} to ${channel}`);
  },
});

export const sendMessage = tool({
  description:
    "Send a Slack message t0 an agent in a channel to perform a specific task",
  parameters: z.object({
    name: z.string(),
    channel: z.string(),
    message: z.string(),
  }),
  execute: async ({ name, channel, message }) => {
    console.log(`Send: ${message} to ${name} in ${channel}`);
  },
});
