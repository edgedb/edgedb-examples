import { streamText } from "ai";
import { createClient } from "edgedb";
import { createGel } from "../../../../../edgedb-js/packages/gel/dist";

export const client = createClient({ tlsSecurity: "insecure" });

export async function POST(req: Request) {
  const requestData = await req.json();

  const result = await streamText({
    model: (
      await createGel(client)
    ).languageModel("gpt-4-turbo-preview", {
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
