import { createClient } from "edgedb";
import { createAI } from "@edgedb/ai";
import { EdgeDBStream, StreamingTextResponse } from "ai";

export const dynamic = "force-dynamic";

export const client = createClient({ tlsSecurity: "insecure" });

const gpt4Ai = createAI(client, {
  model: "gpt-4-turbo-preview",
});

const booksAi = gpt4Ai.withContext({ query: "Book" });

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const res = await booksAi.streamRag(prompt);

  const stream = EdgeDBStream(res);
  return new StreamingTextResponse(stream);
}
