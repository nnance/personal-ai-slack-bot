import { CoreMessage, generateText, LanguageModelV1, tool, ToolSet } from "ai";

// TODO: implement an agent registry to allow for multiple agents
// TODO: provide a method to retrieve a bullet list of available agents
// TODO: provide a way to switch between agents
export interface SlackAgentProps {
  name: string;
  description: string;
  handle: string;
  model: LanguageModelV1;
  system: string;
  tools?: (channel: string, thread?: string) => ToolSet;
}

export type SlackAgent = ReturnType<typeof createSlackAgent>;

export interface GenerateResponseProps {
  channel: string;
  content: string;
  messages?: CoreMessage[];
  thread?: string;
}

export function createSlackAgent({ model, system, tools }: SlackAgentProps) {
  return {
    generateResponse: async ({
      channel,
      content,
      messages,
      thread,
    }: GenerateResponseProps) => {
      const toolset = !!tools ? tools(channel, thread) : undefined;
      const message: CoreMessage = { role: "user", content };
      const allMessages = !!messages ? [...messages, message] : [message];

      const { text } = await generateText({
        model,
        system,
        messages: allMessages,
        maxSteps: 10,
        tools: toolset,
      });
      return text;
    },
  };
}
