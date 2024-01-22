import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import auth from "$lib/server/auth";
import { createUser } from "$lib/server/utils";

export const load = async () => ({
  providerInfo: await auth.getProvidersInfo(),
});

export const actions = {
  resendVerEmail: async ({ request, cookies }) => {
    return auth.emailPasswordResendVerificationEmail(
      request,
      cookies,
      async ({ error }) => {
        if (error) {
          return fail(400, { error: error.message });
        } else
          return {
            message: "Verification email sent!",
          };
      }
    );
  },
  signUp: async ({ request, cookies }) => {
    return auth.emailPasswordSignUp(
      request,
      cookies,
      async ({ error, tokenData }) => {
        if (error) {
          return fail(400, { error: error.message });
        } else {
          if (!tokenData) {
            return {
              message:
                `Email verification required: ` +
                `Follow the link in the verification email to finish registration`,
            };
          }
          try {
            await createUser(tokenData);
          } catch (e) {
            let err: any = e instanceof Error ? e.message : String(e);
            try {
              err = JSON.parse(err);
            } catch {}
            return fail(400, {
              error: `Error signing up: ${
                err?.error?.message ?? JSON.stringify(err)
              }`,
            });
          }

          redirect(302, "/");
        }
      }
    );
  },
} satisfies Actions;
