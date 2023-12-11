import { Form, useActionData, Link } from "@remix-run/react";
import { SubmitButton } from "./buttons";

export function SignInForm({ action }: { action: any }) {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="flex flex-col w-[22rem]" method="post">
      {actionData?.error ? (
        <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
          {actionData.error}
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
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-teal-600 outline-2 focus:outline focus:bg-white"
      />
      <div className="flex text-sm">
        <label htmlFor="password" className="font-medium mb-1 ml-2">
          Password
        </label>
        <Link
          to="/forgot-password"
          className="ml-auto text-teal-600 hover:text-teal-700"
        >
          Forgot password?
        </Link>
      </div>
      <input
        type="password"
        id="password"
        name="password"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-teal-600 outline-2 focus:outline focus:bg-white"
      />
      <SubmitButton label="Sign in" />

      <div className="text-slate-500 mt-3">
        Don't have an account?{" "}
        <Link to="/signup" className="text-teal-600 hover:text-teal-700">
          Sign up
        </Link>
      </div>
    </Form>
  );
}
