import serverAuth, {
  type AuthRouteHandlers,
} from "@edgedb/auth-sveltekit/server";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { client } from "$lib/server/auth";
import { createUser } from "$lib/server/utils";
import { options } from "$lib/auth";

const authRouteHandlers: AuthRouteHandlers = {
  async onOAuthCallback({ error, tokenData, provider, isSignUp }) {
    if (error) {
      redirect(
        303,
        `/signin?oauth_error=${encodeURIComponent(
          `OAuth sign in failed: ${error.message}`
        )}`
      );
    }

    if (isSignUp) {
      await createUser({ client, tokenData, provider });
    }

    redirect(303, "/");
  },
  async onBuiltinUICallback({ error, provider, tokenData, isSignUp }) {
    if (error) {
      redirect(
        303,
        `/?error=${encodeURIComponent(
          `Sign in with built-in UI failed: ${error.message}`
        )}`
      );
    }

    if (!tokenData) {
      redirect(
        303,
        `/?info=${encodeURIComponent(
          `Your email address requires validation before you can sign in. ` +
            `Follow the link in the verification email to continue.`
        )}`
      );
    }

    if (isSignUp) {
      await createUser({ client, tokenData, provider });
    }

    redirect(303, "/");
  },
  async onEmailVerify({ error, tokenData, verificationToken }) {
    if (error) {
      const params = new URLSearchParams({
        email_verification_error: `Email verification failed: ${error.message}`,
      });

      if (verificationToken) {
        params.set("verification_token", verificationToken);
      }

      redirect(303, `/signup?${params.toString()}`);
    }

    await createUser({ client, tokenData });
    redirect(303, "/");
  },
  async onSignout() {
    redirect(303, "/");
  },
};

const { createServerRequestAuth, createAuthRouteHook } = serverAuth(
  client,
  options
);

const createServerAuthClient: Handle = ({ event, resolve }) => {
  event.locals.auth = createServerRequestAuth({ event });

  return resolve(event);
};

export const handle = sequence(
  createServerAuthClient,
  createAuthRouteHook(authRouteHandlers)
);
