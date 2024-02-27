"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/edgedb";

export async function addTodo(content: string) {
  const session = auth.getSession();

  await session.client.query(
    `
      insert Todo {
        content := <str>$content
      }`,
    { content }
  );
  revalidatePath("/");
}

export async function updateTodo(id: string, completed: boolean) {
  const session = auth.getSession();

  await session.client.query(
    `
    update Todo
    filter .id = <uuid>$id
    set {
      completed := <bool>$completed
    }`,
    { id, completed }
  );
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const session = auth.getSession();

  await session.client.query(
    `
    delete Todo
    filter .id = <uuid>$id`,
    { id }
  );
  revalidatePath("/");
}
