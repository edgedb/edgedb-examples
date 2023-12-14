import { SendIcon } from "~/icons";
import { Form, useNavigation } from "@remix-run/react";
import { type Todo, TodoCard } from "./TodoCard";
import { useEffect, useRef } from "react";

export function TodoList({ todos }: { todos: Todo[] }) {
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSubmitting) return;
    formRef.current?.reset();
    inputRef.current?.focus();
  }, [isSubmitting]);

  return (
    <div className="flex flex-col gap-3 mt-4">
      <Form
        ref={formRef}
        method="post"
        className="flex bg-slate-50 border border-slate-200 rounded-xl mb-4 overflow-hidden outline-teal-600 outline-[3px] focus-within:outline focus-within:bg-white"
      >
        <input
          ref={inputRef}
          type="text"
          name="newTodo"
          placeholder="Add new todo..."
          className="flex-grow bg-transparent pl-5 text-lg focus:outline-none focus-visible:ring-0"
        />
        <button
          type="submit"
          className="h-9 w-9 p-3 box-content flex items-center justify-center text-teal-600"
          tabIndex={-1}
        >
          <SendIcon />
        </button>
      </Form>

      {todos.length ? (
        todos.map((todo) => <TodoCard key={todo.id} {...todo} />)
      ) : (
        <div className="border-dashed border-2 border-slate-300 text-slate-500 h-8 py-4 px-8 box-content flex items-center rounded-xl">
          You have no todo's
        </div>
      )}
    </div>
  );
}
