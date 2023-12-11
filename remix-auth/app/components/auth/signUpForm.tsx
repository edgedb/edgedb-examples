import { Form, useActionData, Link } from "@remix-run/react";
import { SubmitButton } from "./buttons";

export function SignUpForm({ action }: { action: any }) {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="flex flex-col w-[22rem]" method="post">
      {actionData?.error || actionData?.message ? (
        <div
          className={`${
            actionData.error
              ? "bg-rose-100 text-rose-950"
              : "bg-sky-200 text-sky-950"
          } px-4 py-3 rounded-md mb-3`}
        >
          {actionData.error || actionData?.message}
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
      <label htmlFor="password" className="font-medium text-sm mb-1 ml-2">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        required
        className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-teal-600 outline-2 focus:outline focus:bg-white"
      />
      <SubmitButton label="Sign up" />

      <div className="text-slate-500 mt-3">
        Already have an account?{" "}
        <Link to="/signin" className="text-teal-600 hover:text-teal-700">
          Sign in
        </Link>
      </div>
    </Form>
  );
}
