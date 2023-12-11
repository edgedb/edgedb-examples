import { useLoaderData, Link, useActionData, Form } from "@remix-run/react";
import { auth } from "~/services/auth.server";
import { BackIcon } from "../icons";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { SubmitButton } from "~/components/auth/buttons";

export const loader = async () => {
  return json({
    providerInfo: await auth.getProvidersInfo(),
  });
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { headers } = await auth.emailPasswordSendPasswordResetEmail(
      request.clone()
    );

    const formData = await request.formData();
    const email = formData.get("email")!.toString();

    return json(
      {
        error: null,
        message: `Password reset email has been sent to '${email}'`,
      },
      { headers }
    );
  } catch (e) {
    let err: any = e instanceof Error ? e.message : String(e);
    try {
      err = JSON.parse(err);
    } catch {}
    return json({
      error: `Error sending password reset: ${
        err?.error?.message ?? JSON.stringify(err)
      }`,
      message: null,
    });
  }
}

export default function ForgotPasswordPage() {
  const { providerInfo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main className="h-screen flex justify-center items-center">
      <div className="p-8 min-w-[32rem]">
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
            <h2 className="text-xl font-semibold">Send password reset email</h2>
            {providerInfo.emailPassword ? (
              <Form className="flex flex-col w-[22rem]" method="post">
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
                      htmlFor="email"
                      className="font-medium text-sm mb-1 ml-2"
                    >
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
            ) : (
              <div className="text-slate-500 italic w-[14rem]">
                Email+Password provider is not enabled
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
