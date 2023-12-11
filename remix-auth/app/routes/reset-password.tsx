import { useLoaderData, Link, useActionData } from "@remix-run/react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { BackIcon } from "../icons";
import { SubmitButton } from "~/components/auth/buttons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const providers = await auth.getProvidersInfo();
  let resetToken = new URL(request.url).searchParams.get("reset_token");

  if (Array.isArray(resetToken)) {
    resetToken = resetToken[0];
  }

  const isTokenValid =
    (resetToken && auth.isPasswordResetTokenValid(resetToken)) || false;

  return json({
    providers,
    isTokenValid,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { headers } = await auth.emailPasswordResetPassword(request.clone());
    return redirect("/", { headers });
  } catch (e) {
    let err: any = e instanceof Error ? e.message : String(e);
    try {
      err = JSON.parse(err);
    } catch {}
    return json({
      error: `Error resetting password: ${
        err?.error?.message ?? JSON.stringify(err)
      }`,
    });
  }
};

export default function ResetPasswordPage() {
  const { providers, isTokenValid } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main className="my-auto p-8 min-w-[32rem]">
      <Link
        to={"/"}
        className="text-slate-600 inline-flex gap-1 items-center mb-2"
      >
        <BackIcon />
        Home
      </Link>
      <h1 className="text-3xl font-semibold mb-6">Email+Password</h1>

      <div className="flex gap-[5rem] w-max">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Reset password</h2>
          {providers.emailPassword ? (
            isTokenValid ? (
              <form method="post" className="flex flex-col w-[22rem]">
                {actionData?.error ? (
                  <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
                    {actionData.error}
                  </div>
                ) : null}

                {actionData?.message ? (
                  <div className="bg-sky-200 text-sky-950 px-4 py-3 rounded-md mb-3">
                    {actionData.message}
                  </div>
                ) : (
                  <>
                    <label
                      htmlFor="password"
                      className="font-medium text-sm mb-1 ml-2"
                    >
                      New password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      className="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
                    />
                    <SubmitButton label="Set new password" />
                  </>
                )}
              </form>
            ) : (
              <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3 w-[22rem]">
                Reset token is invalid, it may have expired.{" "}
                <Link to="/forgot-password" className="text-sky-600">
                  Try sending another reset email
                </Link>
              </div>
            )
          ) : (
            <div className="text-slate-500 italic w-[14rem]">
              Email+Password provider is not enabled
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
