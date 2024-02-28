import { fail, redirect } from "@sveltejs/kit";
import { createUser } from "$lib/server/utils";
import { parseError } from "$lib/utils";
import type { Actions } from "./$types";

export const load = async ({ locals }) => ({
  providerInfo: await locals.auth.getProvidersInfo(),
});

export const actions = {
  resendVerEmail: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      await locals.auth.emailPasswordResendVerificationEmail(formData);

      return {
        message: "Verification email sent!",
      };
    } catch (e) {
      return fail(400, {
        error: `Error signing up: ${parseError(e)}`,
      });
    }
  },
  signUp: async ({ locals, request }) => {
    const formData = await request.formData();
    const client = locals.auth.session.client;

    try {
      const { tokenData } = await locals.auth.emailPasswordSignUp(formData);

      if (!tokenData) {
        return {
          message:
            `Email verification required: ` +
            `Follow the link in the verification email to finish registration`,
        };
      }

      await createUser({ client, tokenData });
    } catch (e) {
      return fail(400, {
        error: `Error signing up: ${parseError(e)}`,
      });
    }

    redirect(303, "/");
  },
} satisfies Actions;
