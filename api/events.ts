import {
  AppMentionEvent,
  AssistantThreadStartedEvent,
  GenericMessageEvent,
  type SlackEvent,
} from "@slack/web-api";
import {
  client,
  convertToSlackMarkdown,
  getBotId,
  getHistory,
  getThread,
  removeAllBotMentions,
  removeBotMention,
  sendMessage,
} from "./slack";
import { waitUntil } from "@vercel/functions";
import { generateChatResponse, generateResponse } from "./ai";
import { slackToCoreMessage } from "./adapters";

async function handleNewAppMention(event: AppMentionEvent, botUserId: string) {
  console.log("Handling app mention");
  if (event.bot_id || event.bot_id === botUserId || event.bot_profile) {
    console.log("Skipping app mention");
    return;
  }

  const { thread_ts, channel } = event;

  const messages = !!thread_ts
    ? await getThread(channel, thread_ts).then((thread) => thread.messages!)
    : await getHistory(channel).then((history) => history.messages!);

  const stripped = removeAllBotMentions(botUserId, messages);
  const chatMessages = slackToCoreMessage(botUserId, stripped);
  const response = await generateChatResponse(chatMessages, event.text);
  const markdown = convertToSlackMarkdown(response);
  return sendMessage(markdown, channel, thread_ts);
}

async function assistantThreadMessage(event: AssistantThreadStartedEvent) {
  const { channel_id, thread_ts } = event.assistant_thread;
  console.log(`Thread started: ${channel_id} ${thread_ts}`);

  await sendMessage("Hello, How can I help you today?", channel_id, thread_ts);

  await client.assistant.threads.setSuggestedPrompts({
    channel_id: channel_id,
    thread_ts: thread_ts,
    prompts: [
      {
        title: "Get the weather",
        message: "What is the current weather in London?",
      },
      {
        title: "Get the news",
        message: "What is the latest Premier League news from the BBC?",
      },
    ],
  });
}

async function handleNewAssistantMessage(
  event: GenericMessageEvent,
  botUserId: string
) {
  if (
    event.bot_id ||
    event.bot_id === botUserId ||
    event.bot_profile ||
    !event.thread_ts
  )
    return;

  const { channel, thread_ts, text } = event;
  console.log(`New Assistant Message: ${channel} ${thread_ts}`);

  if (!text) {
    return new Response("Success!", { status: 200 });
  }

  const message = removeBotMention(botUserId, text);
  const response = await generateResponse(message);
  const markdown = convertToSlackMarkdown(response);
  return sendMessage(markdown, channel, thread_ts);
}

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
      waitUntil(handleNewAppMention(event, botUserId));
    }

    if (event.type === "assistant_thread_started") {
      waitUntil(assistantThreadMessage(event));
    }

    if (
      event.type === "message" &&
      !event.subtype &&
      event.channel_type === "im" &&
      !event.bot_id &&
      !event.bot_profile &&
      event.bot_id !== botUserId
    ) {
      waitUntil(handleNewAssistantMessage(event, botUserId));
    }

    return new Response("Success!", { status: 200 });
  } catch (error) {
    console.error("Error generating response", error);
    return new Response("Error generating response", { status: 500 });
  }
}
