import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import auth from "$lib/server/auth";

export const load = async () => ({
  providers: await auth.getProvidersInfo(),
});

export const actions = {
  default: async ({ request, cookies }) => {
    return auth.emailPasswordSignIn(request, cookies, ({ error }) => {
      if (error) {
        return fail(400, { error: error?.message });
      } else {
        redirect(302, "/");
      }
    });
  },
} satisfies Actions;
