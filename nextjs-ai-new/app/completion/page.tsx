"use client";

import { useCompletion } from "ai/react";
import { RunIcon, GPTLogo } from "../icons";
import { useEffect, useState } from "react";

export default function Completion() {
  const [question, setQuestion] = useState("");
  const {
    completion,
    setCompletion,
    input,
    setInput,
    error,
    handleInputChange,
    handleSubmit,
  } = useCompletion();

  useEffect(() => {
    if (completion && input) {
      setInput("");
    }
  }, [completion]);

  return (
    <main className="flex min-h-screen flex-col items-center px-16 pt-[25vh] max-w-3xl mx-auto gap-4 pb-28">
      {!input && !completion && (
        <>
          <GPTLogo />
          <h1 className="mt-4">Ask me something.</h1>
        </>
      )}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}
      {completion && (
        <div className="text-left w-full">
          <p className="mb-4">Q: {question}</p>
          <p className={`${"text-gray-300 max-w-1/3"}`}>A: {completion}</p>
        </div>
      )}
      <form
        className="fixed bottom-8 w-full max-w-[640px]"
        onSubmit={handleSubmit}
      >
        <input
          className="border pl-4 py-2.5 rounded-xl border-neutral-700 outline-none w-[676px] text-[#bfbfbf] placeholder:text-[#666] focus:border-neutral-600 bg-[#191919] shadow-[0px_34px_0px_0px_#191919;] -ml-3"
          placeholder="Ask a question..."
          onChange={(e) => {
            setQuestion(input);
            setCompletion("");
            handleInputChange(e);
          }}
          value={input}
        />
        <button className={`absolute -right-1 top-[12px]`}>
          <RunIcon className={` ${input ? "text-[#9e6bbd]" : "text-[#666]"}`} />
        </button>
      </form>
    </main>
  );
}
