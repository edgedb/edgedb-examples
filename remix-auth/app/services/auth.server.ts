import {
  type RemixAuthOptions,
  createServerAuth,
} from "@edgedb/auth-remix/server";
import { createClient } from "edgedb";

export const authConfig: RemixAuthOptions = {
  baseUrl: "http://localhost:3000",
  passwordResetPath: "/reset-password",
};

export const client = createClient({
  tlsSecurity: "insecure",
});

export const auth = createServerAuth(client, authConfig);
