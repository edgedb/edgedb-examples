import { createClient } from "edgedb";
import { createAI } from "@edgedb/ai";
import { EdgeDBStream, StreamingTextResponse } from "ai";

export const client = createClient();

const gpt3Ai = createAI(client, {
  model: "gpt-3.5-turbo",
});

const booksAi = gpt3Ai.withContext({ query: "Book" });

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const requestData = await req.json();
  const query = requestData.messages
    .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
    .join("\n");
  console.dir({ requestData, query }, { depth: 5 });
  const res = await booksAi.streamRag(query);

  const stream = EdgeDBStream(res);

  return new StreamingTextResponse(stream);
}
