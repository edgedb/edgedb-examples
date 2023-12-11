import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { BackIcon } from "../icons";
import { SignUpForm } from "../components/auth/signUpForm";
import { type ActionFunctionArgs } from "@remix-run/node";
import { transformSearchParams } from "~/utils";
import { ResendVerificationEmail } from "~/components/auth/resendVerificationEmail";

export const loader = async () => {
  const providerInfo = await auth.getProvidersInfo();

  return json({
    providerInfo,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { tokenData, headers } = await auth.signupWithEmailPassword(request);

    if (!tokenData) {
      return json(
        {
          error: null,
          message:
            `Email verification required: ` +
            `Follow the link in the verification email to finish registration`,
        },
        { headers }
      );
    }

    await auth.createUser(tokenData);

    return redirect("/", { headers });
  } catch (e) {
    let err: any = e instanceof Error ? e.message : String(e);
    try {
      err = JSON.parse(err);
    } catch {}
    return json({
      error: `Error signing up: ${err?.error?.message ?? JSON.stringify(err)}`,
      message: null,
    });
  }
};

export default function SignUpPage() {
  const { providerInfo } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const params = transformSearchParams(searchParams);

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
        <h1 className="text-3xl font-semibold mb-6">Sign up</h1>

        <div className="flex gap-[5rem] w-max">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Email+Password</h2>

            {params.email_verification_error ? (
              <div className="bg-rose-100 text-rose-950 px-4 py-3 rounded-md w-[22rem] flex flex-col items-start">
                {params.email_verification_error}
                {params.verification_token ? (
                  <ResendVerificationEmail
                    verificationToken={
                      Array.isArray(params.verification_token)
                        ? params.verification_token[0]
                        : params.verification_token
                    }
                  />
                ) : null}
              </div>
            ) : null}

            {providerInfo.emailPassword ? (
              <SignUpForm action={action} />
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
