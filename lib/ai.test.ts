import { createAgentRegistry, createSlackAgent, SlackAgentProps } from "./ai";

describe("createAgentRegistry", () => {
  let registry: ReturnType<typeof createAgentRegistry>;
  let mockAgent: ReturnType<typeof createSlackAgent>;

  beforeEach(() => {
    registry = createAgentRegistry();

    const mockAgentProps: SlackAgentProps = {
      name: "Test Agent",
      description: "A test agent for unit testing.",
      handle: "@test-agent",
      model: {} as any, // Mock model
      system: "Test system",
    };

    mockAgent = createSlackAgent(mockAgentProps);
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
    const anotherAgent = createSlackAgent({
      name: "Another Agent",
      description: "Another test agent.",
      handle: "@another-agent",
      model: {} as any, // Mock model
      system: "Another system",
    });

    registry.addAgent(mockAgent);
    registry.addAgent(anotherAgent);

    const agentList = registry.getAgentList();

    expect(agentList).toContain(mockAgent);
    expect(agentList).toContain(anotherAgent);
    expect(agentList).toHaveLength(2);
  });

  it("should return a formatted list of available agents", () => {
    const anotherAgent = createSlackAgent({
      name: "Another Agent",
      description: "Another test agent.",
      handle: "@another-agent",
      model: {} as any, // Mock model
      system: "Another system",
    });

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
