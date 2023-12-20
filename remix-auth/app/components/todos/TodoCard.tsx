import { Form } from "@remix-run/react";
import { CheckIcon, DeleteIcon } from "~/icons";

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  created_on: string;
}

export function TodoCard({ id, content, completed, created_on }: Todo) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 text-lg flex hover:scale-[1.02] transition-transform duration-75">
      <Form method="put">
        <input
          type="hidden"
          name="todo"
          defaultValue={JSON.stringify({ id, content, completed, created_on })}
        />
        <button
          type="submit"
          className={`w-9 h-9 rounded-full mr-4 flex-shrink-0 flex items-center justify-center cursor-pointer ${
            completed ? "bg-sky-400 text-white" : "border border-slate-400"
          }`}
        >
          {completed ? <CheckIcon /> : null}
        </button>
      </Form>

      <span
        className={`flex-shrink overflow-hidden break-words py-1 mr-auto ${
          completed ? "line-through opacity-70" : ""
        }`}
      >
        {content}
      </span>

      <Form method="delete">
        <input
          type="hidden"
          name="todo"
          defaultValue={JSON.stringify({ id, content, completed, created_on })}
        />
        <button
          type="submit"
          className="w-9 h-9 rounded-full ml-4 flex-shrink-0 flex items-center justify-center cursor-pointer text-slate-400 hover:bg-rose-500 hover:text-white"
        >
          <DeleteIcon />
        </button>
      </Form>
    </div>
  );
}
