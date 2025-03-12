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
