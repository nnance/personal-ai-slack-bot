import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { exa } from "../agents/tools";

async function generateSearchQueries(topic: string, n: number) {
  const userPrompt = `I'm writing a research report on ${topic} and need help coming up with diverse search queries.
Please generate a list of ${n} search queries that would be useful for writing a research report on ${topic}. These queries can be in various formats, from simple keywords to more complex phrases. Do not add any formatting or numbering to the queries.`;

  const { text: completion } = await generateText({
    system:
      "The user will ask you to help generate some search queries. Respond with only the suggested queries in plain text with no extra formatting, each on its own line.",
    prompt: userPrompt,
    temperature: 1,
    model: openai("gpt-4"),
  });
  return completion
    .split("\n")
    .filter((s) => s.trim().length > 0)
    .slice(0, n);
}

type SearchResults = Awaited<ReturnType<typeof getSearchResults>>;

async function getSearchResults(queries: string[], linksPerQuery = 2) {
  let results = [];
  for (const query of queries) {
    const searchResponse = await exa.searchAndContents(query, {
      numResults: linksPerQuery,
      useAutoprompt: false,
    });
    results.push(...searchResponse.results);
  }
  return results;
}

async function synthesizeReport(
  topic: string,
  searchContents: SearchResults,
  contentSlice = 750
) {
  const inputData = searchContents
    .map(
      (item) =>
        `--START ITEM--\nURL: ${item.url}\nCONTENT: ${item.text.slice(0, contentSlice)}\n--END ITEM--\n`
    )
    .join("");
  const { text } = await generateText({
    system:
      "You are a helpful research assistant. Write a report according to the user's instructions.",
    prompt:
      "Input Data:\n" +
      inputData +
      `Write a two paragraph research report about ${topic} based on the provided information. Include as many sources as possible. Provide citations in the text using footnote notation ([#]). First provide the report, followed by a single "References" section that lists all the URLs used, in the format [#] <url>.`,
    model: openai("gpt-4o"),
  });

  return text;
}

async function researcher(topic: string) {
  console.log(`Starting research on topic: "${topic}"`);

  const searchQueries = await generateSearchQueries(topic, 3);
  console.log("Generated search queries:", searchQueries);

  const searchResults = await getSearchResults(searchQueries);
  console.log(
    `Found ${searchResults.length} search results. Here's the first one:`,
    searchResults[0]
  );

  console.log("Synthesizing report...");
  const report = await synthesizeReport(topic, searchResults);

  return report;
}

researcher("Sam Altman")
  .then((r) => console.log(r, "\n"))
  .catch(console.error);

researcher("renaissance art")
  .then((r) => console.log(r, "\n"))
  .catch(console.error);
