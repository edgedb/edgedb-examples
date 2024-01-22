import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import auth from "$lib/server/auth";

export const actions = {
  default: async ({ cookies }) =>
    auth.signout(cookies, async () => {
      redirect(302, "/");
    }),
} satisfies Actions;
