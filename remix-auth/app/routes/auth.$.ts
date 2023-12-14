import { redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const { loader } = auth.createAuthRouteHandlers({
  async onOAuthCallback({ error, tokenData, provider, isSignUp }) {
    if (error) {
      return redirect(
        `/signin?oauth_error=${encodeURIComponent(
          `OAuth sign in failed: ${error.message}`
        )}`
      );
    }
    if (isSignUp) {
      await auth.createUser(tokenData, provider);
    }
    return redirect("/");
  },
  async onBuiltinUICallback({ error, provider, tokenData, isSignUp }) {
    if (error) {
      return redirect(
        `/?error=${encodeURIComponent(
          `Sign in with built-in UI failed: ${error.message}`
        )}`
      );
    }

    if (!tokenData) {
      return redirect(
        `/?info=${encodeURIComponent(
          `Your email address requires validation before you can sign in. ` +
            `Follow the link in the verification email to continue.`
        )}`
      );
    }

    if (isSignUp) {
      await auth.createUser(tokenData, provider);
    }

    return redirect("/");
  },
  async onEmailVerify({ error, tokenData, verificationToken }) {
    if (error) {
      const params = new URLSearchParams({
        email_verification_error: `Email verification failed: ${error.message}`,
      });

      if (verificationToken) {
        params.set("verification_token", verificationToken);
      }
      return redirect(`/signup?${params.toString()}`);
    }

    await auth.createUser(tokenData);

    return redirect("/");
  },
  async onSignout() {
    return redirect("/");
  },
});
