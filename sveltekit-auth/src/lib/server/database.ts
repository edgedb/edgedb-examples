import auth from "./auth";

export const addTodo = async (request: Request, todo: string) => {
  const session = auth.getSession(request);

  await session.client.query(
    `
      insert Todo {
        content := <str>$content
      }`,
    { content: todo }
  );
};

export const updateTodo = async (
  request: Request,
  { id, completed }: { id: string; completed: boolean }
) => {
  const session = auth.getSession(request);

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

export const deleteTodo = async (request: Request, id: string) => {
  const session = auth.getSession(request);

  await session.client.query(
    `
      delete Todo
      filter .id = <uuid>$id`,
    { id }
  );
};
