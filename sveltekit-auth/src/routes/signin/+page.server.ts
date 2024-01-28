import { fail, redirect } from "@sveltejs/kit";
import { parseError } from "$lib/utils";
import type { Actions } from "./$types";

export const load = async ({ locals }) => ({
  providers: await locals.auth.getProvidersInfo(),
});

export const actions = {
  default: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      await locals.auth.emailPasswordSignIn(formData);
    } catch (e) {
      return fail(400, {
        error: `Error signing up: ${parseError(e)}`,
      });
    }

    redirect(303, "/");
  },
} satisfies Actions;
