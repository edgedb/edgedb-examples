import { Form } from "@remix-run/react";
import SubmitButton from "./SubmitButton";

interface ResetPasswordFormProps {
  error?: string | null;
  message?: string | null;
}

export default function ForgotPasswordForm({
  error,
  message,
}: ResetPasswordFormProps) {
  return (
    <Form className="flex flex-col w-[22rem]" method="post">
      {error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="bg-sky-200 text-sky-950 px-4 py-3 rounded-md mb-3">
          {message}
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
            className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-teal-600 outline-2 focus:outline focus:bg-white"
          />
          <SubmitButton label="Send reset email" />
        </>
      )}
    </Form>
  );
}
