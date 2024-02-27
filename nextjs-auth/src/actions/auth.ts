"use server";

import { redirect } from "next/navigation";

import { Octokit } from "@octokit/core";

import {
  BuiltinProviderNames,
  TokenData,
  UserError,
} from "@edgedb/auth-nextjs/app";
import { auth, client } from "@/edgedb";

const {
  signout,
  emailPasswordSignIn,
  emailPasswordSignUp,
  emailPasswordSendPasswordResetEmail,
  emailPasswordResetPassword,
  emailPasswordResendVerificationEmail,
} = auth.createServerActions();

export { signout, emailPasswordResendVerificationEmail };

export interface AuthFormState {
  error: string | null;
  message?: string;
}

export async function signinWithState(
  prevState: AuthFormState | void,
  formData: FormData
) {
  try {
    await emailPasswordSignIn(formData);
  } catch (err) {
    console.error(err);
    return {
      error:
        err instanceof UserError
          ? `Error signing in: ${err.message}`
          : `Unknown error occurred signing in`,
    };
  }
  redirect("/");
}

export async function signupWithState(
  prevState: AuthFormState | void,
  formData: FormData
) {
  try {
    const tokenData = await emailPasswordSignUp(formData);
    if (!tokenData) {
      return {
        error: null,
        message:
          `Email verification required: ` +
          `Follow the link in the verification email to finish registration`,
      };
    }
    await createUser(tokenData);
  } catch (err) {
    console.error(err);
    return {
      error:
        err instanceof UserError
          ? `Error signing up: ${err.message}`
          : `Unknown error occurred signing up`,
    };
  }
  redirect("/");
}

export async function sendPasswordResetWithState(
  prevState: AuthFormState | void,
  formData: FormData
) {
  try {
    const email = formData.get("email")!.toString();
    await emailPasswordSendPasswordResetEmail({ email });
    return {
      error: null,
      message: `Password reset email has been sent to '${email}'`,
    };
  } catch (err) {
    console.error(err);
    return {
      error:
        err instanceof UserError
          ? `Error sending password reset: ${err.message}`
          : `Unknown error occurred sending password reset`,
    };
  }
}

export async function resetPasswordWithState(
  reset_token: string,
  prevState: AuthFormState | void,
  formData: FormData
) {
  try {
    await emailPasswordResetPassword({
      reset_token,
      password: formData.get("password")!.toString(),
    });
  } catch (err) {
    console.error(err);
    return {
      error:
        err instanceof UserError
          ? `Error resetting password: ${err.message}`
          : `Unknown error occurred resetting password`,
    };
  }
  redirect("/");
}

export async function createUser(
  tokenData: TokenData,
  provider?: BuiltinProviderNames
) {
  let username: string | null = null;
  if (tokenData.provider_token && provider === "builtin::oauth_github") {
    const { data } = await new Octokit({
      auth: tokenData.provider_token,
    }).request("get /user");

    username = data.login;
  }
  await client.query(
    `
  with identity := (select ext::auth::Identity filter .id = <uuid>$identity_id),
  insert User {
    identity := identity,
    name := <optional str>$username ?? (
      select ext::auth::EmailFactor filter .identity = identity
    ).email
  } unless conflict on .identity`,
    {
      identity_id: tokenData.identity_id,
      username: username,
    }
  );
}
