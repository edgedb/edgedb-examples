import type { RequestEvent } from "@sveltejs/kit";

export const addTodo = async ({ locals }: RequestEvent, todo: string) => {
  const session = locals.auth.getSession();

  await session.client.query(
    `
      insert Todo {
        content := <str>$content
      }`,
    { content: todo }
  );
};

export const updateTodo = async (
  { locals }: RequestEvent,
  { id, completed }: { id: string; completed: boolean }
) => {
  const session = locals.auth.getSession();

  await session.client.query(
    `
      update Todo
      filter .id = <uuid>$id
      set {
        completed := <bool>$completed
      }`,
    { id, completed }
  );
};

export const deleteTodo = async ({ locals }: RequestEvent, id: string) => {
  const session = locals.auth.getSession();

  await session.client.query(
    `
      delete Todo
      filter .id = <uuid>$id`,
    { id }
  );
};
