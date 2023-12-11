import { useRef } from "react";
import { CheckIcon, DeleteIcon, SendIcon } from "~/icons";
import { Form } from "@remix-run/react";
import { type ActionFunction, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  created_on: Date;
}

export function TodosList({ todos }: { todos: Todo[] }) {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <Form
        method="post"
        action="/"
        // ref={ref}
        // action={(formData: FormData) => {
        //   const newTodo = formData.get("new-todo")?.toString() ?? "";
        //   if (newTodo) {
        //     optimisticUpdateTodos({ action: "add", content: newTodo });
        //     ref.current?.reset();
        //     return addTodo(newTodo);
        //   }
        // }}
        className="flex bg-slate-50 border border-slate-200 rounded-xl mb-4 overflow-hidden outline-teal-600 outline-[3px] focus-within:outline focus-within:bg-white"
      >
        <input
          name="new-todo"
          placeholder="Add new todo..."
          className="flex-grow bg-transparent pl-5 text-lg focus:outline-none focus-visible:ring-0"
        />
        <button
          className="h-9 w-9 p-3 box-content flex items-center justify-center text-teal-600"
          tabIndex={-1}
        >
          <SendIcon />
        </button>
      </Form>

      {todos.length ? (
        groupTodos(todos, (todo: Todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            updateTodo={(completed) => {
              return updateTodo(todo.id, completed);
            }}
            deleteTodo={() => {
              return deleteTodo(todo.id);
            }}
          />
        ))
      ) : (
        <div className="border-dashed border-2 border-slate-300 text-slate-500 h-8 py-4 px-8 box-content flex items-center rounded-xl">
          You have no todo's
        </div>
      )}
    </div>
  );
}

function groupTodos(todos: Todo[], render: (todo: Todo) => JSX.Element) {
  const now = Date.now();
  const groupedTodos = todos.reduce(
    (groups, todo) => {
      const createdOn = todo.created_on.getTime();
      if (createdOn > now - 24 * 60 * 60 * 1000) {
        groups.today.push(todo);
      } else if (createdOn > now - 48 * 60 * 60 * 1000) {
        groups.yesterday.push(todo);
      } else if (createdOn > now - 7 * 24 * 60 * 60 * 1000) {
        groups.thisWeek.push(todo);
      } else {
        groups.older.push(todo);
      }
      return groups;
    },
    {
      today: [] as Todo[],
      yesterday: [] as Todo[],
      thisWeek: [] as Todo[],
      older: [] as Todo[],
    }
  );

  return (
    <>
      {groupedTodos.today.length ? (
        <>
          <h2 className="font-medium mt-2">Today</h2>
          {groupedTodos.today.map((todo) => render(todo))}
        </>
      ) : null}
      {groupedTodos.yesterday.length ? (
        <>
          <h2 className="font-medium mt-2">Yesterday</h2>
          {groupedTodos.yesterday.map((todo) => render(todo))}
        </>
      ) : null}
      {groupedTodos.thisWeek.length ? (
        <>
          <h2 className="font-medium mt-2">This week</h2>
          {groupedTodos.thisWeek.map((todo) => render(todo))}
        </>
      ) : null}
      {groupedTodos.older.length ? (
        <>
          <h2 className="font-medium mt-2">Older than a week</h2>
          {groupedTodos.older.map((todo) => render(todo))}
        </>
      ) : null}
    </>
  );
}

export function TodoCard({
  todo,
  updateTodo,
  deleteTodo,
}: {
  todo: Todo;
  updateTodo: (completed: boolean) => void;
  deleteTodo: () => void;
}) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 text-lg flex hover:scale-[1.02] transition-transform duration-75">
      <button
        onClick={() => updateTodo(!todo.completed)}
        className={`w-9 h-9 rounded-full mr-4 flex-shrink-0 flex items-center justify-center cursor-pointer ${
          todo.completed ? "bg-sky-400 text-white" : "border border-slate-400"
        }`}
      >
        {todo.completed ? <CheckIcon /> : null}
      </button>

      <span
        className={`flex-shrink overflow-hidden break-words py-1 mr-auto ${
          todo.completed ? "line-through opacity-70" : ""
        }`}
      >
        {todo.content}
      </span>

      {!todo.id.startsWith("new-") ? (
        <button
          onClick={() => deleteTodo()}
          className="w-9 h-9 rounded-full ml-4 flex-shrink-0 flex items-center justify-center cursor-pointer text-slate-400 hover:bg-rose-500 hover:text-white"
        >
          <DeleteIcon />
        </button>
      ) : null}
    </div>
  );
}

export async function addTodo(content: string) {
  const session = auth.getSession();

  await session.client
    //workaround for this bug: https://github.com/edgedb/edgedb/issues/6340
    //   .withConfig({ apply_access_policies: false })
    .query(
      `
      insert Todo {
        content := <str>$content
      }`,
      { content }
    );
  // revalidatePath("/");
}

export async function updateTodo(id: string, completed: boolean) {
  //   const session = auth.getSession();
  //   await session.client.query(
  //     `
  //       update Todo
  //       filter .id = <uuid>$id
  //       set {
  //         completed := <bool>$completed
  //       }`,
  //     { id, completed }
  //   );
  //   revalidatePath("/");
}

export async function deleteTodo(id: string) {
  //   const session = auth.getSession();
  //   await session.client.query(
  //     `
  //       delete Todo
  //       filter .id = <uuid>$id`,
  //     { id }
  //   );
  //   revalidatePath("/");
}
