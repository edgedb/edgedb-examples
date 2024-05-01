import { createClient } from "edgedb";
import { createAI } from "@edgedb/ai";

export const client = createClient();

const gpt3Ai = createAI(client, {
  model: "gpt-3.5-turbo",
});

const booksAi = gpt3Ai.withContext({ query: "Book" });

export async function POST(req: Request) {
  const requestData = await req.json();
  const res = await booksAi.streamRag(requestData.prompt);

  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
