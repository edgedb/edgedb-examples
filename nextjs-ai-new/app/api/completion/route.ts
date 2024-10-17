import { streamText } from "ai";
import { createClient } from "edgedb";
import { createGel } from "../../../../../edgedb-js/packages/gel/dist";

export const client = createClient();

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: (
      await createGel(client)
    ).languageModel("gpt-4-turbo-preview", { context: { query: "Book" } }),
    prompt,
  });

  return result.toDataStreamResponse();
}
