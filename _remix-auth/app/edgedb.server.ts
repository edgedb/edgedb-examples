import { createClient } from "edgedb";
import { createServerAuth } from "@edgedb/auth-remix/server";

import { authConfig } from "./edgedb";

export const client = createClient({
  instanceName: "_localdev",
  database: "nextjs",
  tlsSecurity: "insecure",
});

export const auth = createServerAuth(client, authConfig);
