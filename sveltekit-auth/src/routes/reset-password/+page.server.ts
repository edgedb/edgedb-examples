import { fail, redirect } from "@sveltejs/kit";
import { parseError } from "$lib/utils";
import type { Actions } from "./$types";

export const load = async ({ locals, url }) => {
  const providers = await locals.auth.getProvidersInfo();
  let resetToken = url.searchParams.get("reset_token");

  if (Array.isArray(resetToken)) {
    resetToken = resetToken[0];
  }

  const isTokenValid =
    (resetToken && locals.auth.isPasswordResetTokenValid(resetToken)) || false;

  return {
    providers,
    isTokenValid,
    resetToken,
  };
};

export const actions = {
  default: async ({ locals, request }) => {
    try {
      const formData = await request.formData();
      await locals.auth.emailPasswordResetPassword(formData);
    } catch (e) {
      return fail(400, {
        error: `Error signing up: ${parseError(e)}`,
      });
    }

    redirect(303, "/");
  },
} satisfies Actions;
