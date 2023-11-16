import { createClient } from "edgedb";
import createAuth from "@edgedb/auth-nextjs/app";

export const client = createClient({
  // Note: when developing locally you will need to set tls  security to
  // insecure, because the development server uses  self-signed certificates
  // which will cause api calls with  the fetch api to fail.
  tlsSecurity: "insecure",
});

export const auth = createAuth(client, {
  baseUrl: "http://localhost:3000",
  passwordResetPath: "/reset-password",
});
