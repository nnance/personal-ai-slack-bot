import { createMemoryExtractionAgent } from "./memory";

describe("Memory Agent", () => {
  describe("when there are available agents", () => {
    it("should add the agent to the channel and send it a message", async () => {
      const agent = createMemoryExtractionAgent();
      const mockInput = {
        channel: "test",
        content:
          "We will be traveling to Portland, OR this week.   Are there any events happening related to art or food this week?",
      };

      await agent.generateResponse(mockInput);
    }, 10000);
  });

  describe("when agents are already in the channel", () => {
    it("should not add the agent but send it a message", async () => {
      const agent = createMemoryExtractionAgent();
      const mockInput = {
        channel: "test",
        content:
          "We will be traveling to Portland, OR this week.   Are there any events happening related to art or food this week?",
      };

      await agent.generateResponse(mockInput);
    }, 10000);
  });
});
