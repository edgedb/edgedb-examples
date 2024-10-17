import { streamText } from "ai";
import { edgedbRag } from "../../../../../edgedb-js/packages/edgedb-ai-sdk/dist";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const textModel = (await edgedbRag).languageModel("gpt-4-turbo-preview");

  const result = await streamText({
    model: textModel.withSettings({ context: { query: "Book" } }),
    prompt,
  });

  return result.toDataStreamResponse();
}

// or

// import { streamText } from "ai";
// import { createClient } from "edgedb";
// import { edgedbRag } from "../../../../../edgedb-js/packages/edgedb-ai-sdk/dist";

// export const client = createClient();

//   const edgedbRag = await createEdgeDBRag(client);
//   const result = await streamText({
//     model: edgedbRag.languageModel("gpt-4-turbo-preview", {
//       context: { query: "Book" },
//     }),
//     prompt,
//   });

// Embedding example

// const embeddingResult = await embed({
//   model: edgedbRag.textEmbeddingModel("text-embedding-3-small"),
//   value: "sunny day at the beach",
// });
