import { type SlackEvent } from "@slack/web-api";
import { getBotId, sendMessage } from "./slack";
import { waitUntil } from "@vercel/functions";
import { generateResponse } from "./ai";

const removeBotMention = (botUserId: string) => async (text: string) =>
  text.includes(`<@${botUserId}>`)
    ? text.split(`<@${botUserId}>`)[1].trim()
    : text;

const convertToSlackMarkdown = (text: string) =>
  text.replace(/\[(.*?)\]\((.*?)\)/g, "<$2|$1>").replace(/\*\*/g, "*");

const postMessage =
  (channel: string, thread_ts: string | undefined) => async (text: string) =>
    sendMessage(text, channel, thread_ts);

export async function POST(request: Request) {
  const rawBody = await request.text();
  const payload = JSON.parse(rawBody);
  const requestType = payload.type as "url_verification" | "event_callback";

  // See https://api.slack.com/events/url_verification
  if (requestType === "url_verification") {
    return new Response(payload.challenge, { status: 200 });
  }

  try {
    const botUserId = await getBotId();

    const event = payload.event as SlackEvent;

    if (event.type === "app_mention") {
      console.log("app mention");
    }

    if (event.type === "assistant_thread_started") {
      console.log("assistant thread started");
    }

    if (
      event.type === "message" &&
      !event.subtype &&
      event.channel_type === "im" &&
      !event.bot_id &&
      !event.bot_profile &&
      event.bot_id !== botUserId
    ) {
      const { channel, thread_ts, text } = event;

      if (!text) {
        return new Response("Success!", { status: 200 });
      }

      waitUntil(
        removeBotMention(botUserId)(text)
          .then(generateResponse)
          .then(convertToSlackMarkdown)
          .then(postMessage(channel, thread_ts))
      );
    }

    return new Response("Success!", { status: 200 });
  } catch (error) {
    console.error("Error generating response", error);
    return new Response("Error generating response", { status: 500 });
  }
}
