"use client";

import { useState } from "react";
import { GPTLogo, RunIcon } from "./icons";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center px-24 pt-[25vh]">
      <GPTLogo />
      <h1 className="mt-4">How can I help you today?</h1>
      <div className="fixed bottom-8 w-[640px]">
        <input
          className="border pl-4 py-2.5 rounded-xl border-neutral-700 bg-transparent outline-none w-full text-[#bfbfbf] placeholder:text-[#666]"
          placeholder="Ask a question..."
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />

        <RunIcon
          className={`absolute right-4 top-[12px] ${
            inputFocused && prompt ? "text-[#279474]" : "text-[#666]"
          }`}
        />
      </div>
    </main>
  );
}
