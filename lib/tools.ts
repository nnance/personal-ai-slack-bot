import { tool } from "ai";
import { z } from "zod";
import Exa from "exa-js";
import { SlackClient } from "./slack";

export const exa = new Exa(process.env.EXA_API_KEY);

export const createInviteToChannel = (channel: string) =>
  tool({
    description:
      "Invite a Slack bot agent to a channel to help with a specific task",
    parameters: z.object({
      name: z.string(),
    }),
    execute: async ({ name }) => {
      console.log(`Invite: ${name} to ${channel}`);
      return { success: true };
    },
  });

export const createSendMessage = (client: SlackClient, channel: string) =>
  tool({
    description:
      "Send a Slack message to an agent in a channel to perform a specific task",
    parameters: z.object({
      name: z.string(),
      message: z.string(),
    }),
    execute: async ({ message }) => {
      client.sendMessage(channel, message);
      return { success: true };
    },
  });

export const searchWeb = () =>
  tool({
    description: "Use this to search the web for information",
    parameters: z.object({
      query: z.string(),
      specificDomain: z
        .string()
        .nullable()
        .describe(
          "a domain to search if the user specifies e.g. bbc.com. Should be only the domain name without the protocol"
        ),
    }),
    execute: async ({ query, specificDomain }) => {
      const { results } = await exa.searchAndContents(query, {
        livecrawl: "always",
        numResults: 3,
        includeDomains: specificDomain ? [specificDomain] : undefined,
      });

      return {
        results: results.map((result) => ({
          title: result.title,
          url: result.url,
          snippet: result.text.slice(0, 1000),
        })),
      };
    },
  });
