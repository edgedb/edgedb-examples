import { fail, type Actions } from "@sveltejs/kit";
import { parseError } from "$lib/utils";

export const load = async ({ locals }) => ({
  providers: await locals.auth.getProvidersInfo(),
});

export const actions = {
  default: async ({ locals, request }) => {
    try {
      const email = (await request.formData()).get("email")?.toString();

      if (!email) {
        return fail(400, { error: "email is required" });
      }

      await locals.auth.emailPasswordSendPasswordResetEmail({ email });

      return {
        message: `Password reset email has been sent to '${email}'`,
      };
    } catch (e) {
      return fail(400, {
        error: `Error signing up: ${parseError(e)}`,
      });
    }
  },
} satisfies Actions;
