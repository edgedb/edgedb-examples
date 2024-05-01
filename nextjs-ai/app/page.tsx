"use client";

import { useState } from "react";
import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import { GPTLogo, RunIcon } from "./icons";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [err, setErr] = useState<string | undefined>(undefined);

  function onParse(event: ParsedEvent | ReconnectInterval) {
    if (event.type === "event" && event.event === "content_block_delta") {
      setAnswer((answer) => answer + JSON.parse(event.data).delta.text);
    }
    return "event" in event ? event.event === "message_stop" : false;
  }

  const parser = createParser(onParse);

  const handleQuery = async () => {
    parser.reset();

    setQuestion(prompt);
    setPrompt("");

    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    // This data is a ReadableStream
    const data = res.body;
    if (!data) return;

    const reader = data.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const decoded = decoder.decode(value);
        parser.feed(decoded);
      }
    } catch (err) {
      console.log(err);
      setErr("An error occurred. Please try again in a few seconds.");
    } finally {
      reader.releaseLock();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-16 pt-[25vh] max-w-2xl mx-auto">
      {!question && (
        <>
          <GPTLogo />
          <h1 className="mt-4">How can I help you today?</h1>
        </>
      )}
      {question && (
        <div className="text-left w-full ">
          <p className="border-b border-neutral-700">{question}</p>
          {answer && (
            <p className="relative mt-4 text-sm">
              <GPTLogo className="w-5 absolute -top-7 -left-8" /> {answer}
            </p>
          )}
          {err && <p>{err}</p>}
        </div>
      )}
      <div className="fixed bottom-8 w-[640px]">
        <input
          className="border pl-4 py-2.5 rounded-xl border-neutral-700 bg-transparent outline-none w-full text-[#bfbfbf] placeholder:text-[#666] focus:border-neutral-600"
          placeholder="Ask a question..."
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
        <button onClick={handleQuery} className={`absolute right-4 top-[12px]`}>
          <RunIcon
            className={` ${
              inputFocused && prompt ? "text-[#9e6bbd]" : "text-[#666]"
            }`}
          />
        </button>
      </div>
    </main>
  );
}
