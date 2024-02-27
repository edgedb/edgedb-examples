"use client";

import { useOptimistic, useRef } from "react";
import { addTodo, deleteTodo, updateTodo } from "@/actions/todos";
import { CheckIcon, DeleteIcon, SendIcon } from "@/app/icons";

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  created_on: Date;
}

export function TodosList({ todos: _todos }: { todos: Todo[] }) {
  const [todos, optimisticUpdateTodos] = useOptimistic<
    Todo[],
    | { action: "add"; content: string }
    | { action: "updateCompleted"; id: string; completed: boolean }
    | { action: "delete"; id: string }
  >(_todos, (todos, action) => {
    switch (action.action) {
      case "add":
        return [
          {
            id: `new-${Math.random()}`,
            content: action.content,
            completed: false,
            created_on: new Date(),
          },
          ...todos,
        ];
      case "updateCompleted":
        return todos.map((todo) =>
          todo.id === action.id
            ? { ...todo, completed: action.completed }
            : todo
        );
      case "delete":
        return todos.filter((todo) => todo.id !== action.id);
    }
  });

  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-3 mt-4">
      <form
        ref={ref}
        action={(formData: FormData) => {
          const newTodo = formData.get("new-todo")?.toString() ?? "";
          if (newTodo) {
            optimisticUpdateTodos({ action: "add", content: newTodo });
            ref.current?.reset();
            return addTodo(newTodo);
          }
        }}
        className="flex bg-slate-50 border border-slate-200 rounded-xl mb-4 overflow-hidden outline-sky-500 outline-[3px] focus-within:outline focus-within:bg-white"
      >
        <input
          name="new-todo"
          placeholder="Add new todo..."
          className="flex-grow bg-transparent pl-5 text-lg focus:outline-none focus-visible:ring-0"
        />
        <button
          className="h-9 w-9 p-3 box-content flex items-center justify-center text-sky-500"
          tabIndex={-1}
        >
          <SendIcon />
        </button>
      </form>

      {todos.length ? (
        groupTodos(todos, (todo: Todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            updateTodo={(completed) => {
              optimisticUpdateTodos({
                action: "updateCompleted",
                id: todo.id,
                completed,
              });
              return updateTodo(todo.id, completed);
            }}
            deleteTodo={() => {
              optimisticUpdateTodos({ action: "delete", id: todo.id });
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
    <form
      action={() => updateTodo(!todo.completed)}
      className="bg-white shadow-sm rounded-xl p-4 text-lg flex hover:scale-[1.02] transition-transform duration-75"
    >
      <button
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
          formAction={() => deleteTodo()}
          className="w-9 h-9 rounded-full ml-4 flex-shrink-0 flex items-center justify-center cursor-pointer text-slate-400 hover:bg-rose-500 hover:text-white"
        >
          <DeleteIcon />
        </button>
      ) : null}
    </form>
  );
}
