import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ locals }) => {
    await locals.auth.signout();
    redirect(303, "/");
  },
} satisfies Actions;
