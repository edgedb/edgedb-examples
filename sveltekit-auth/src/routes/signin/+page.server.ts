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
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();

      if (!email) {
        return fail(400, { error: "email is required" });
      }
      if (!password) {
        return fail(400, { error: "password is required" });
      }

      await locals.auth.emailPasswordSignIn({ email, password });
    } catch (e) {
      return fail(400, {
        error: `Error signing up: ${parseError(e)}`,
      });
    }

    redirect(303, "/");
  },
} satisfies Actions;
