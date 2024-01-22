import { redirect } from "@sveltejs/kit";
import auth from "$lib/server/auth";
import { createUser } from "$lib/server/utils";

export const GET = auth.createAuthRouteHandlers({
  async onOAuthCallback({ error, tokenData, provider, isSignUp }) {
    if (error) {
      redirect(
        302,
        `/signin?oauth_error=${encodeURIComponent(
          `OAuth sign in failed: ${error.message}`
        )}`
      );
    }

    if (isSignUp) {
      await createUser(tokenData, provider);
    }

    redirect(302, "/");
  },
  async onBuiltinUICallback({ error, provider, tokenData, isSignUp }) {
    if (error) {
      redirect(
        302,
        `/?error=${encodeURIComponent(
          `Sign in with built-in UI failed: ${error.message}`
        )}`
      );
    }

    if (!tokenData) {
      redirect(
        302,
        `/?info=${encodeURIComponent(
          `Your email address requires validation before you can sign in. ` +
            `Follow the link in the verification email to continue.`
        )}`
      );
    }

    if (isSignUp) {
      await createUser(tokenData, provider);
    }

    redirect(302, "/");
  },
  async onEmailVerify({ error, tokenData, verificationToken }) {
    if (error) {
      const params = new URLSearchParams({
        email_verification_error: `Email verification failed: ${error.message}`,
      });

      if (verificationToken) {
        params.set("verification_token", verificationToken);
      }
      redirect(302, `/signup?${params.toString()}`);
    }

    await createUser(tokenData);

    redirect(302, "/");
  },
  async onSignout() {
    redirect(302, "/");
  },
});
