import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import auth from "$lib/server/auth";

export const load = async ({ request }) => {
  const providers = await auth.getProvidersInfo();
  let resetToken = new URL(request.url).searchParams.get("reset_token");

  if (Array.isArray(resetToken)) {
    resetToken = resetToken[0];
  }

  const isTokenValid =
    (resetToken && auth.isPasswordResetTokenValid(resetToken)) || false;

  return {
    providers,
    isTokenValid,
    resetToken,
  };
};

export const actions = {
  default: async ({ request, cookies }) => {
    return auth.emailPasswordResetPassword(
      request,
      cookies,
      async ({ error }) => {
        if (error) {
          return fail(400, { error: error?.message });
        } else redirect(302, "/");
      }
    );
  },
} satisfies Actions;
