import { redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const { loader } = auth.createAuthRouteHandlers({
  async onBuiltinUICallback({ error, provider, tokenData, isSignUp, headers }) {
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
        )}`,
        { headers: headers || undefined }
      );
    }
    if (isSignUp) {
      await auth.createUser(tokenData, provider);
    }

    return redirect("/", { headers });
  },
  async onEmailVerify({ error, tokenData, verificationToken, headers }) {
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

    return redirect("/", { headers });
  },
  async onSignout({ headers }) {
    return redirect("/", { headers });
  },
});
