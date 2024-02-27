"use client";

import { startTransition, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";

import Link from "next/link";

import {
  AuthFormState,
  signout,
  signinWithState,
  signupWithState,
  sendPasswordResetWithState,
  resetPasswordWithState,
  emailPasswordResendVerificationEmail,
} from "@/actions/auth";

export function SignOutButton() {
  return (
    <button
      className="border border-slate-200 rounded-lg bg-white py-2 px-3 font-medium text-sm"
      onClick={() =>
        startTransition(() => {
          signout();
        })
      }
    >
      Sign out (action)
    </button>
  );
}

function SubmitButton({
  label,
  submittingLabel,
}: {
  label: string;
  submittingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={`bg-sky-500 text-white p-3 rounded-md mt-3 shadow-md hover:scale-[1.03] transition-transform ${
        pending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {pending ? submittingLabel : label}
    </button>
  );
}

export function SignInForm() {
  const [state, formAction] = useFormState<AuthFormState | void, FormData>(
    signinWithState,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col w-[22rem]">
      {state && state.error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {state.error}
        </div>
      ) : null}

      <label htmlFor="email" className="font-medium text-sm mb-1 ml-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <div className="flex text-sm">
        <label htmlFor="password" className="font-medium mb-1 ml-2">
          Password
        </label>
        <Link
          href="/forgot-password"
          className="ml-auto text-slate-600 hover:text-sky-600"
        >
          Forgot password?
        </Link>
      </div>
      <input
        type="password"
        id="password"
        name="password"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <SubmitButton label="Sign in" submittingLabel="Signing in..." />

      <div className="text-slate-500 mt-3">
        Don't have an account?{" "}
        <Link href="/signup" className="text-sky-600 hover:text-sky-700">
          Sign up
        </Link>
      </div>
    </form>
  );
}

export function SignUpForm() {
  const [state, formAction] = useFormState<AuthFormState | void, FormData>(
    signupWithState,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col w-[22rem]">
      {state && (state.error || state.message) ? (
        <div
          className={`${
            state.error
              ? "bg-rose-100 text-rose-950"
              : "bg-sky-200 text-sky-950"
          } px-4 py-3 rounded-md mb-3`}
        >
          {state.error || state.message}
        </div>
      ) : null}

      <label htmlFor="email" className="font-medium text-sm mb-1 ml-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <label htmlFor="password" className="font-medium text-sm mb-1 ml-2">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
      />
      <SubmitButton label="Sign up" submittingLabel="Signing up..." />

      <div className="text-slate-500 mt-3">
        Already have an account?{" "}
        <Link href="/signin" className="text-sky-600 hover:text-sky-700">
          Sign in
        </Link>
      </div>
    </form>
  );
}

export function SendResetEmailForm() {
  const [state, formAction] = useFormState<AuthFormState | void, FormData>(
    sendPasswordResetWithState,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col w-[22rem]">
      {state && state.error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {state.error}
        </div>
      ) : null}

      {state && state.message ? (
        <div className="bg-sky-200 text-sky-950 px-4 py-3 rounded-md mb-3">
          {state.message}
        </div>
      ) : (
        <>
          <label htmlFor="email" className="font-medium text-sm mb-1 ml-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
          />
          <SubmitButton label="Send reset email" submittingLabel="Sending..." />
        </>
      )}
    </form>
  );
}

export function ResetPasswordForm({ resetToken }: { resetToken: string }) {
  const [state, formAction] = useFormState<AuthFormState | void, FormData>(
    resetPasswordWithState.bind(null, resetToken),
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col w-[22rem]">
      {state && state.error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {state.error}
        </div>
      ) : null}

      {state && state.message ? (
        <div className="bg-sky-200 text-sky-950 px-4 py-3 rounded-md mb-3">
          {state.message}
        </div>
      ) : (
        <>
          <label htmlFor="password" className="font-medium text-sm mb-1 ml-2">
            New password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
          />
          <SubmitButton
            label="Update password"
            submittingLabel="Updating password..."
          />
        </>
      )}
    </form>
  );
}

export function ResendVerificationEmail({
  verificationToken,
}: {
  verificationToken: string;
}) {
  const [sent, setSent] = useState(false);
  const [sending, startTransition] = useTransition();

  return sent || sending ? (
    <div className="text-slate-600 mt-2">
      {sent ? "Verification email sent!" : "Sending verification email..."}
    </div>
  ) : (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await emailPasswordResendVerificationEmail({
            verification_token: verificationToken,
          });
          setSent(true);
        })
      }
      className="text-sky-600 mt-2"
    >
      Resend verification email
    </button>
  );
}
