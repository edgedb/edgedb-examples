import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import auth from "~/services/auth.server";

export const action: ActionFunction = () => auth.signout(() => redirect("/"));
