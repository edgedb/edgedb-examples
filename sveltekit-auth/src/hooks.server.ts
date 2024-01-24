import createServerAuth from "@edgedb/auth-sveltekit/server";
import { options } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import { createUser } from "$lib/server/utils";
import { createClient } from "edgedb";

export const handle = async ({ event, resolve }) => {
  const client = createClient({
    //Note: when developing locally you will need to set tls  security to insecure, because the dev server uses  self-signed certificates which will cause api calls with the fetch api to fail.
    tlsSecurity: "insecure",
  });

  event.locals.client = client;
  event.locals.auth = createServerAuth(client, options, event);

  const pathname = new URL(event.request.url).pathname;
  if (pathname.startsWith("/auth")) {
    return event.locals.auth.createAuthRouteHandlers(
      {
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
      },
      event.request
    );
  } else {
    return resolve(event);
  }
};
