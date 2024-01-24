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
      const verificationToken = (await request.formData())
        .get("verification_token")
        ?.toString();

      if (!verificationToken) {
        return fail(400, { error: "verification token is required" });
      }

      await locals.auth.emailPasswordResendVerificationEmail({
        verificationToken,
      });

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
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email) {
      return fail(400, { error: "email is required" });
    }
    if (!password) {
      return fail(400, { error: "password is required" });
    }

    try {
      const { tokenData } = await locals.auth.emailPasswordSignUp({
        email,
        password,
      });

      if (!tokenData) {
        return {
          message:
            `Email verification required: ` +
            `Follow the link in the verification email to finish registration`,
        };
      }

      await createUser({ client: locals.client, tokenData });
    } catch (e) {
      return fail(400, {
        error: `Error signing up: ${parseError(e)}`,
      });
    }

    redirect(303, "/");
  },
} satisfies Actions;
