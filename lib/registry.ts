import { CoreMessage } from "ai";

// TODO: provide a way to switch between agents

export interface SlackAgent {
  name: string;
  description: string;
  handle: string;
  botId?: string;
  generateResponse: (props: GenerateResponseProps) => Promise<string>;
}

export interface GenerateResponseProps {
  channel: string;
  content: string;
  messages?: CoreMessage[];
  thread?: string;
}

export type AgentRegistry = ReturnType<typeof createAgentRegistry>;

export function createAgentRegistry(defaults: SlackAgent[] = []) {
  const agents = new Map<string, SlackAgent>(
    defaults.map((agent) => [agent.name, agent])
  );
  return {
    addAgent: (agent: SlackAgent) => agents.set(agent.name, agent),
    getAgent: (name: string) => agents.get(name),
    getAgentByHandle: (handle: string) =>
      Array.from(agents.values()).find((agent) => agent.handle === handle),
    getAgentList: () => Array.from(agents.values()),
    getAvailableAgents: () =>
      Array.from(agents.values()).map(
        ({ name, handle, description }) => `${name}: ${handle} - ${description}`
      ),
  };
}
