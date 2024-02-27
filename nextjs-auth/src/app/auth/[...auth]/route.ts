import { redirect } from "next/navigation";
import { auth } from "@/edgedb";
import { createUser } from "@/actions/auth";

export const { GET, POST } = auth.createAuthRouteHandlers({
  async onOAuthCallback({ error, tokenData, provider, isSignUp }) {
    if (error) {
      return redirect(
        `/signin?oauth_error=${encodeURIComponent(
          `OAuth sign in failed: ${error.message}`
        )}`
      );
    }
    if (isSignUp) {
      await createUser(tokenData, provider);
    }
    redirect("/");
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
    await createUser(tokenData);
    redirect("/");
  },
  async onBuiltinUICallback({ error, tokenData, provider, isSignUp }) {
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
      await createUser(tokenData, provider);
    }
    redirect("/");
  },
  onSignout() {
    redirect("/");
  },
});
