import { WebClient, type SlackEvent } from "@slack/web-api";

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

const getBotId = async () => {
  const { user_id: botUserId } = await client.auth.test();

  if (!botUserId) {
    throw new Error("botUserId is undefined");
  }
  return botUserId;
};

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
      console.log("message");
    }

    return new Response("Success!", { status: 200 });
  } catch (error) {
    console.error("Error generating response", error);
    return new Response("Error generating response", { status: 500 });
  }
}
