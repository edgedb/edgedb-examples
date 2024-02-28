import type { Todo } from "$lib/components/todos/types";
import { addTodo, deleteTodo, updateTodo } from "$lib/server/database";
import { fail, type Actions } from "@sveltejs/kit";

export async function load({ locals }) {
  const session = locals.auth.session;
  const { client } = session;

  const builtinUIEnabled = await client.queryRequiredSingle<boolean>(
    `select exists ext::auth::UIConfig`
  );

  const isSignedIn = await session.isSignedIn();
  const todos = isSignedIn
    ? await client.query<Todo>(
        `select Todo {id, content, completed, created_on}
    order by .created_on desc`
      )
    : null;

  const username = isSignedIn
    ? await client.queryRequiredSingle<string>(`select global currentUser.name`)
    : null;

  return {
    builtinUIEnabled,
    isSignedIn,
    todos,
    username,
  };
}

export const actions = {
  addTodo: async (event) => {
    const formData = await event.request.formData();
    const todo = formData.get("newTodo")?.toString();

    if (!todo) {
      return fail(400, { todo, missing: true });
    }

    await addTodo(event, todo);
    return { success: true };
  },
  updateTodo: async (event) => {
    const formData = await event.request.formData();
    const todo = formData.get("todo")?.toString();

    if (!todo) {
      return fail(400, { todo, missing: true });
    }

    const { id, completed } = JSON.parse(todo);
    await updateTodo(event, { id, completed: !completed });
    return { success: true };
  },
  deleteTodo: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get("id")?.toString();

    if (!id) {
      return fail(400, { id, missing: true });
    }

    await deleteTodo(event, id);
    return { success: true };
  },
} satisfies Actions;
