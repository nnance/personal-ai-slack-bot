# Personal AI Slack Bot

AI-powered Slack bot that serves as a personal assistant accessible through both desktop and mobile Slack applications.

## Overview

The AI Slack Bot is designed to provide users with a conversational AI assistant integrated directly into their Slack workspace. It will allow users to interact with advanced AI capabilities through natural language, helping them accomplish various tasks, retrieve information, and automate workflows without leaving Slack.

## Features

- **Natural Language Understanding**: The AI Slack Bot can understand and interpret user messages in natural language, allowing users to interact with the bot in a conversational manner.

- **Task Automation**: Users can automate tasks and workflows by interacting with the AI Slack Bot, which can perform various actions based on user requests.

- **Information Retrieval**: The AI Slack Bot can retrieve information from external sources, databases, or APIs and provide users with relevant data or answers to their queries.

- **Integration with Slack**: The AI Slack Bot is integrated directly into the Slack workspace, allowing users to access its features and capabilities without leaving the Slack application.

- **Customization and Personalization**: Users can customize and personalize the AI Slack Bot to suit their preferences, needs, and requirements, making it a truly personal assistant.

## Getting Started

To get started with the AI Slack Bot, follow these steps:

1. **Create a Slack App**: Create a new Slack app in your workspace and configure it to enable the necessary permissions and features for the AI Slack Bot.

2. **Set Up the AI Engine**: Set up the AI engine that powers the Slack bot, such as a natural language processing (NLP) model or a conversational AI platform.

3. **Integrate the AI Engine with Slack**: Integrate the AI engine with Slack using the Slack API and webhooks to enable communication between the AI engine and the Slack workspace.

4. **Deploy the AI Slack Bot**: Deploy the AI Slack Bot to a server or cloud platform to ensure it is accessible and available to users in the Slack workspace.

## Local Development

Use the [Vercel CLI](https://vercel.com/docs/cli) and [untun](https://github.com/unjs/untun) to test out this project locally:

```sh
pnpm i -g vercel
vercel dev --listen 3000 --yes
```

```sh
npx untun@latest tunnel http://localhost:3000
```

Make sure to modify the [subscription URL](./README.md/#enable-slack-events) to the `untun` URL.

> Note: you may encounter issues locally with `waitUntil`. This is being investigated.

## Adding Agent to Slack

To add the agent to your Slack workspace, follow these steps:

1. **Create a Slack App**: Create a new Slack app in your workspace and configure it with the necessary permissions and features.

2. **Enable Event Subscriptions**: Enable event subscriptions for your Slack app and subscribe to the necessary events, such as `message.im` and `app_mention`.

3. **Enable Slack Events**: Enable Slack events for your app and configure the request URL to point to the deployed AI Slack Bot.

4. **Install the App**: Install the app in your Slack workspace and authorize it to access the necessary scopes and permissions.

### Scopes

The AI Slack Bot requires the following scopes to function properly:

- `app_mentions:read`: View messages that directly mention @AI in conversations that the app is in
- `assistant:write`: Allow AI to act as an App Agent
- `channels:history`: View messages and other content in public channels that AI has been added to
- `channels:read`: View basic information about public channels in a workspace
- `chat:write`: Send messages as @AI
- `groups:history`: View messages and other content in private channels that AI has been added to
- `im:history`: View messages and other content in direct messages that AI has been added to
- `im:write`: Start direct messages with people
- `reactions:write`: Add and edit emoji reactions
- `users:read`: View people in a workspace

### Enable Slack Events

These are the events that the AI Slack Bot listens to:

- `app_mention`: Subscribe to only the message events that mention your app or bot - requires `app_mentions:read` scope
- `assistant_thread_started`: An App Agent thread was started
- `message.im`: A message was posted in a direct message channel - requires `im:history` scope

Events that haven't been implemented yet:

- `message.channels`: A message was posted to a channel - requires `channels:history` scope
- `message.groups`: A message was posted to a private channel - requires `groups:history` scope
