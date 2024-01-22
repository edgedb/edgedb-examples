import type { Todo } from "$lib/components/todos/types";
import auth, { client } from "$lib/server/auth";
import { addTodo, deleteTodo, updateTodo } from "$lib/server/database";
import { fail, type Actions } from "@sveltejs/kit";

export async function load({ request }) {
  const builtinUIEnabled = await client.queryRequiredSingle<boolean>(
    `select exists ext::auth::UIConfig`
  );

  const session = auth.getSession(request);
  const isSignedIn = await session.isSignedIn();
  const todos = isSignedIn
    ? await session.client.query<Todo>(
        `select Todo {id, content, completed, created_on}
    order by .created_on desc`
      )
    : null;

  const username = isSignedIn
    ? await session.client.queryRequiredSingle<string>(
        `select global currentUser.name`
      )
    : null;

  return {
    builtinUIEnabled,
    isSignedIn,
    todos,
    username,
  };
}

export const actions = {
  addTodo: async ({ request }) => {
    const data = await request.formData();
    const todo = data.get("newTodo")?.toString();

    if (!todo) {
      return fail(400, { todo, missing: true });
    }

    await addTodo(request, todo);
    return { success: true };
  },
  updateTodo: async ({ request }) => {
    const data = await request.formData();
    const todo = data.get("todo")?.toString();

    if (!todo) {
      return fail(400, { todo, missing: true });
    }

    const { id, completed } = JSON.parse(todo);
    await updateTodo(request, { id, completed: !completed });
    return { success: true };
  },
  deleteTodo: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id")?.toString();

    if (!id) {
      return fail(400, { id, missing: true });
    }

    await deleteTodo(request, id);
    return { success: true };
  },
} satisfies Actions;
