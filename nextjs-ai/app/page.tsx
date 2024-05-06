"use client";

import { useChat } from "ai/react";
import { GPTLogo, RunIcon } from "./icons";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat();

  return (
    <main className="flex min-h-screen flex-col items-center px-16 pt-[25vh] max-w-4xl mx-auto gap-4">
      {!input && messages.length === 0 && (
        <>
          <GPTLogo />
          <h1 className="mt-4">How can I help you today?</h1>
        </>
      )}
      {messages.map((m) =>
        m.role === "user" ? (
          <div
            key={m.id}
            className={`${"bg-[#1a202c] text-white border border-blue-300 p-4 self-end max-w-1/3 rounded-xl"}`}
          >
            {m.content}
          </div>
        ) : (
          <div
            key={m.id}
            className={`${"bg-[#2d3748] text-gray-300 border border-gray-600 p-4 self-start max-w-1/3 rounded-xl"}`}
          >
            <div className="opacity-30 text-xs font-semibold">AI</div>
            {m.content!}
          </div>
        )
      )}
      {error && <p className="">{error.message}</p>}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}
      <form className="fixed bottom-8 w-full max-w-[640px]" onSubmit={handleSubmit}>
        <input
          className="border pl-4 py-2.5 rounded-xl border-neutral-700 bg-transparent outline-none w-full text-[#bfbfbf] placeholder:text-[#666] focus:border-neutral-600"
          placeholder="Ask a question..."
          onChange={handleInputChange}
          value={input}
        />
        <button className={`absolute right-4 top-[12px]`}>
          <RunIcon className={` ${input ? "text-[#9e6bbd]" : "text-[#666]"}`} />
        </button>
      </form>
    </main>
  );
}
