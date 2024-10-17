import { streamText } from "ai";
import { createClient } from "edgedb";
import { createEdgeDBRag } from "../../../../../edgedb-js/packages/edgedb-ai-sdk/dist";

export const client = createClient();

export async function POST(req: Request) {
  const requestData = await req.json();

  const edgedbRag = await createEdgeDBRag(client);
  const textModel = edgedbRag.languageModel("gpt-4-turbo-preview");

  const result = await streamText({
    model: textModel.withSettings({
      context: { query: "Book" },
      prompt: {
        custom: requestData.messages,
        name: "light-rag",
      },
    }),
    prompt: requestData.messages.at(-1).content,
  });

  return result.toDataStreamResponse();
}
