import { createClientAuth, RemixAuthOptions } from "@edgedb/auth-remix/client";

export const authConfig: RemixAuthOptions = {
  baseUrl: "http://localhost:3000",
};

export const auth = createClientAuth(authConfig);
