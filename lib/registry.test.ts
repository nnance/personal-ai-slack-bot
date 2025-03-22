import { createAgentRegistry, SlackAgent } from "./registry";

describe("createAgentRegistry", () => {
  let registry: ReturnType<typeof createAgentRegistry>;
  let mockAgent: SlackAgent;

  beforeEach(() => {
    registry = createAgentRegistry();

    mockAgent = {
      name: "Test Agent",
      description: "A test agent for unit testing.",
      handle: "@test-agent",
      generateResponse: async () => "Test response",
    };
  });

  it("should add an agent to the registry", () => {
    registry.addAgent(mockAgent);
    const retrievedAgent = registry.getAgent(mockAgent.name);

    expect(retrievedAgent).toBe(mockAgent);
  });

  it("should retrieve an agent by name", () => {
    registry.addAgent(mockAgent);
    const retrievedAgent = registry.getAgent("Test Agent");

    expect(retrievedAgent).toBe(mockAgent);
  });

  it("should return undefined for a non-existent agent", () => {
    const retrievedAgent = registry.getAgent("NonExistentAgent");

    expect(retrievedAgent).toBeUndefined();
  });

  it("should retrieve an agent by handle", () => {
    registry.addAgent(mockAgent);
    const retrievedAgent = registry.getAgentByHandle("@test-agent");

    expect(retrievedAgent).toBe(mockAgent);
  });

  it("should return undefined for a non-existent handle", () => {
    const retrievedAgent = registry.getAgentByHandle("@non-existent-handle");

    expect(retrievedAgent).toBeUndefined();
  });

  it("should return a list of all agents", () => {
    const anotherAgent: SlackAgent = {
      name: "Another Agent",
      description: "Another test agent.",
      handle: "@another-agent",
      generateResponse: async () => "Another test response",
    };

    registry.addAgent(mockAgent);
    registry.addAgent(anotherAgent);

    const agentList = registry.getAgentList();

    expect(agentList).toContain(mockAgent);
    expect(agentList).toContain(anotherAgent);
    expect(agentList).toHaveLength(2);
  });

  it("should return a formatted list of available agents", () => {
    const anotherAgent: SlackAgent = {
      name: "Another Agent",
      description: "Another test agent.",
      handle: "@another-agent",
      generateResponse: async () => "Another test response",
    };

    registry.addAgent(mockAgent);
    registry.addAgent(anotherAgent);

    const availableAgents = registry.getAvailableAgents();

    expect(availableAgents).toContain(
      "Test Agent: @test-agent - A test agent for unit testing."
    );
    expect(availableAgents).toContain(
      "Another Agent: @another-agent - Another test agent."
    );
  });
});
