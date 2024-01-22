import createServerAuth from "@edgedb/auth-sveltekit/server";
import { createClient } from "edgedb";
import { options } from "$lib/auth";

export const client = createClient({
  //Note: when developing locally you will need to set tls  security to insecure, because the dev server uses  self-signed certificates which will cause api calls with the fetch api to fail.
  tlsSecurity: "insecure",
});

const auth = createServerAuth(client, options);

export default auth;
