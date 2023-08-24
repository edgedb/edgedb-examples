"use client";

import { useState, useRef } from "react";
import { SSE } from "sse.js";
import { errors } from "./constants";

export default function Home() {
  const eventSourceRef = useRef<SSE>();

  const [prompt, setPrompt] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = (
    e: KeyboardEvent | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);
    setQuestion(prompt);
    setAnswer("");
    setPrompt("");
    generateAnswer(prompt);
  };

  const generateAnswer = async (query: string) => {
    if (eventSourceRef.current) eventSourceRef.current.close();

    const eventSource = new SSE(`api/generate-answer`, {
      payload: JSON.stringify({ query }),
    });
    eventSourceRef.current = eventSource;

    eventSource.onerror = handleError;
    eventSource.onmessage = handleMessage;
    eventSource.stream();
  };

  function handleError(err: any) {
    setIsLoading(false);

    const errMessage =
      err.data === errors.flagged ? errors.flagged : errors.default;

    setError(errMessage);
  }

  function handleMessage(e: MessageEvent<any>) {
    try {
      setIsLoading(false);
      if (e.data === "[DONE]") return;

      const chunkResponse = JSON.parse(e.data);
      const chunk = chunkResponse.choices[0].delta?.content || "";
      setAnswer((answer) => answer + chunk);
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#2e2e2e]">
      <form className="bg-[#2e2e2e] w-[540px] relative">
        <input
          className={`py-5 pl-6 pr-[40px] rounded-md bg-[#1f1f1f] w-full
            outline-[#1f1f1f] focus:outline outline-offset-2 text-[#b3b3b3]
            mb-8 placeholder-[#4d4d4d]`}
          placeholder="Ask a question..."
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        ></input>
        <button
          onClick={handleSubmit}
          className="absolute top-[25px] right-4"
          disabled={!prompt}
        >
          <ReturnIcon
            className={`${!prompt ? "fill-[#4d4d4d]" : "fill-[#1b9873]"}`}
          />
        </button>
        <div className="h-96 px-6">
          {question && (
            <p className="text-[#b3b3b3] pb-4 mb-8 border-b border-[#525252] ">
              {question}
            </p>
          )}
          {(isLoading && <LoadingDots />) ||
            (error && <p className="text-[#b3b3b3]">{error}</p>) ||
            (answer && <p className="text-[#b3b3b3]">{answer}</p>)}
        </div>
      </form>
    </main>
  );
}

function ReturnIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M12 0C11.4477 0 11 0.447715 11 1C11 1.55228 11.4477 2 12
            2H17C17.5523 2 18 2.44771 18 3V6C18 6.55229 17.5523 7 17
            7H3.41436L4.70726 5.70711C5.09778 5.31658 5.09778 4.68342 4.70726
            4.29289C4.31673 3.90237 3.68357 3.90237 3.29304 4.29289L0.306297
            7.27964L0.292893 7.2928C0.18663 7.39906 0.109281 7.52329 0.0608469
            7.65571C0.0214847 7.76305 0 7.87902 0 8C0 8.23166 0.078771 8.44492
            0.210989 8.61445C0.23874 8.65004 0.268845 8.68369 0.30107
            8.71519L3.29289 11.707C3.68342 12.0975 4.31658 12.0975 4.70711
            11.707C5.09763 11.3165 5.09763 10.6833 4.70711 10.2928L3.41431
            9H17C18.6568 9 20 7.65685 20 6V3C20 1.34315 18.6568 0 17 0H12Z`}
      />
    </svg>
  );
}

function LoadingDots() {
  return (
    <div className="grid gap-2">
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-1 h-1 bg-[#b3b3b3] rounded-full"></div>
        <div className="w-1 h-1 bg-[#b3b3b3] rounded-full"></div>
        <div className="w-1 h-1 bg-[#b3b3b3] rounded-full"></div>
      </div>
    </div>
  );
}
