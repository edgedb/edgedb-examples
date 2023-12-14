import { Form } from "@remix-run/react";
import { TodosList, type Todo } from "~/components/todos/TodoList";

interface TodosProps {
  todos: Todo[];
  username: string;
  signoutUrl: string;
}

export default function Todos({ todos, username, signoutUrl }: TodosProps) {
  return (
    <main className="p-8 w-[40rem]">
      <div className="flex bg-slate-50 shadow-sm p-3 rounded-xl mb-8 items-center gap-3">
        <span className="mr-auto ml-2">
          <span className="text-slate-500">Signed in as </span>
          {username}
        </span>
        <a
          href={signoutUrl}
          className="border border-slate-200 rounded-lg bg-white py-2 px-3 font-medium text-sm"
        >
          Sign out
        </a>
        <Form action="/signout" method="post">
          <button
            className="border border-slate-200 rounded-lg bg-white py-2 px-3 font-medium text-sm"
            type="submit"
          >
            Sign out (action)
          </button>
        </Form>
      </div>

      <h1 className="text-3xl font-semibold">Todo's</h1>
      <TodosList todos={todos} />
    </main>
  );
}
