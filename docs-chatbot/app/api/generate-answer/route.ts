import { codeBlock, oneLineTrim } from "common-tags";
import * as edgedb from "edgedb";
import e from "dbschema/edgeql-js";
import { errors } from "../../constants";
import { initOpenAIClient } from "@/utils";

export const config = { runtime: "edge" };

const openai = initOpenAIClient();

const client = edgedb.createHttpClient({
  tlsSecurity: process.env.TLS_SECURITY,
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const sanitizedQuery = query.trim();

    const flagged = await isQueryFlagged(query);

    if (flagged) throw new Error(errors.flagged);

    const embedding = await getEmbedding(query);

    const context = await getContext(embedding);

    const prompt = createFullPrompt(sanitizedQuery, context);

    const answer = await getOpenAiAnswer(prompt);

    return new Response(answer.body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error: any) {
    console.error(error);

    const uiError = error.message || errors.default;

    return new Response(uiError, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function isQueryFlagged(query: string) {
  const moderation = await openai.moderations.create({
    input: query,
  });

  const [{ flagged }] = moderation.results;

  return flagged;
}

async function getEmbedding(query: string) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query.replaceAll("\n", " "),
  });

  const [{ embedding }] = embeddingResponse.data;

  return embedding;
}

const getSectionsQuery = e.params(
  {
    target: e.OpenAIEmbedding,
    matchThreshold: e.float64,
    matchCount: e.int16,
    minContentLength: e.int16,
  },
  (params) => {
    return e.select(e.Section, (section) => {
      const dist = e.ext.pgvector.cosine_distance(
        section.embedding,
        params.target
      );
      return {
        content: true,
        tokens: true,
        dist,
        filter: e.op(
          e.op(e.len(section.content), ">", params.minContentLength),
          "and",
          e.op(dist, "<", params.matchThreshold)
        ),
        order_by: {
          expression: dist,
          empty: e.EMPTY_LAST,
        },
        limit: params.matchCount,
      };
    });
  }
);

async function getContext(embedding: number[]) {
  const sections = await getSectionsQuery.run(client, {
    target: embedding,
    matchThreshold: 0.3,
    matchCount: 8,
    minContentLength: 20,
  });

  let tokenCount = 0;
  let context = "";

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const content = section.content;
    tokenCount += section.tokens;

    if (tokenCount >= 1500) {
      tokenCount -= section.tokens;
      break;
    }

    context += `${content.trim()}\n---\n`;
  }

  return context;
}

function createFullPrompt(query: string, context: string) {
  const systemMessage = `
        As an enthusiastic EdgeDB expert keen to assist, respond to questions in
        markdown, referencing the given EdgeDB sections.

        If unable to help based on documentation, respond with:
        "Sorry, I don't know how to help with that."`;

  return codeBlock`
        ${oneLineTrim`${systemMessage}`}

        EdgeDB sections: """
        ${context}
        """

        Question: """
        ${query}
        """`;
}

async function getOpenAiAnswer(prompt: string) {
  const completion = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0.1,
      stream: true,
    })
    .asResponse();

  return completion;
}
