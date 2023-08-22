import OpenAI from "openai";

export function initOpenAIClient() {
  if (!process.env.OPENAI_API_KEY)
    throw new Error("Missing environment variable OPENAI_API_KEY");

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
}
