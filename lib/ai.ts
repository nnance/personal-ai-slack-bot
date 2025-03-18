import { CoreMessage, generateText, LanguageModelV1, tool, ToolSet } from "ai";

export interface SlackAgentProps {
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

      const { text } = await generateText({
        model,
        system,
        messages: !!messages ? [...messages, message] : [message],
        maxSteps: 10,
        tools: toolset,
      });
      return text;
    },
  };
}
