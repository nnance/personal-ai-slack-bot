import { CoreMessage, generateText, LanguageModelV1, tool, ToolSet } from "ai";

export interface SlackAgentProps {
  model: LanguageModelV1;
  system: string;
  tools?: ToolSet;
}

export type SlackAgent = ReturnType<typeof createSlackAgent>;

export function createSlackAgent({ model, system, tools }: SlackAgentProps) {
  return {
    generateResponse: async (content: string, messages: CoreMessage[] = []) => {
      const { text } = await generateText({
        model,
        system,
        messages: [...messages, { role: "user", content }],
        tools,
      });
      return text;
    },
  };
}
