import { codeBlock, oneLineTrim } from "common-tags";
import * as edgedb from "edgedb";
import e from "dbschema/edgeql-js";

export const config = {
  runtime: "edge",
};

const openAIApiKey = process.env.OPENAI_API_KEY;

const client = edgedb.createHttpClient({
  tlsSecurity: process.env.TLS_SECURITY,
});

export const errors = {
  flagged: `OpenAI has declined to answer your question due to their
        [usage-policies](https://openai.com/policies/usage-policies). Please try
        another question.`,
  default: "There was an error processing your request. Please try again.",
};

export async function POST(req: Request) {
  try {
    if (!openAIApiKey)
      throw new Error("Missing environment variable OPENAI_API_KEY");

    const { query } = await req.json();
    const sanitizedQuery = query.trim();

    const moderatedQuery = await moderateQuery(sanitizedQuery, openAIApiKey);
    if (moderatedQuery.flagged) throw new Error(errors.flagged);

    const embedding = await getEmbedding(query, openAIApiKey);

    const context = await getContext(embedding);

    const prompt = createFullPrompt(sanitizedQuery, context);

    const answer = await getOpenAiAnswer(prompt, openAIApiKey);

    return new Response(answer, {
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

async function moderateQuery(query: string, apiKey: string) {
  const moderationResponse = await fetch(
    "https://api.openai.com/v1/moderations",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: query,
      }),
    }
  ).then((res) => res.json());

  const [results] = moderationResponse.results;
  return results;
}

async function getEmbedding(query: string, apiKey: string) {
  const embeddingResponse = await fetch(
    "https://api.openai.com/v1/embeddings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: query.replaceAll("\n", " "),
      }),
    }
  );

  if (embeddingResponse.status !== 200) {
    throw new Error(embeddingResponse.statusText);
  }

  const {
    data: [{ embedding }],
  } = await embeddingResponse.json();

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

async function getOpenAiAnswer(prompt: string, secretKey: string) {
  const completionRequestObject = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1024,
    temperature: 0.1,
    stream: true,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(completionRequestObject),
  });

  return response.body;
}
