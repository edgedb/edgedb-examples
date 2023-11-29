import { redirect } from "@remix-run/node";
import { auth } from "~/edgedb.server";

export const { loader } = auth.createAuthRouteHandlers({
  async onBuiltinUICallback({ error, provider, tokenData, isSignUp }) {
    console.log(error, provider, tokenData, isSignUp);

    return redirect("/");
  },
});
