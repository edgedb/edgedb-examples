import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const { headers } = await auth.signout(request);
  return redirect("/", { headers });
};
