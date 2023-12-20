import createServerAuth, {
  type RemixAuthOptions,
} from "@edgedb/auth-remix/server";
import { createClient } from "edgedb";

export const authConfig: RemixAuthOptions = {
  baseUrl: "http://localhost:3000",
  passwordResetPath: "/reset-password",
};

export const client = createClient({
  //Note: when developing locally you will need to set tls  security to insecure, because the dev server uses  self-signed certificates which will cause api calls with the fetch api to fail.
  tlsSecurity: "insecure",
});

export const auth = createServerAuth(client, authConfig);
