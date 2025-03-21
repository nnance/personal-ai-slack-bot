import { tool } from "ai";
import { z } from "zod";
import Exa from "exa-js";
import { SlackClient } from "../lib/slack";

export const exa = new Exa(process.env.EXA_API_KEY);

export const createInviteToChannel = (client: SlackClient, channel: string) =>
  tool({
    description:
      "Invite a Slack bot agent to a channel to help with a specific task",
    parameters: z.object({
      name: z.string(),
    }),
    execute: async ({ name }) => {
      console.log(`Invite: ${channel} to ${name}`);
      client.inviteToChannel(name, channel);
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
    execute: async ({ name, message }) => {
      console.log(`Send message: ${message} to ${name} in ${channel}`);
      const mention = name.startsWith("@") ? name : `@${name}`;
      client.sendMessage(`${mention} ${message}`, channel);
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
      console.log(`Searching for: ${query}`);
      const { results } = await exa.searchAndContents(query, {
        livecrawl: "auto",
        livecrawlTimeout: 5000,
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
