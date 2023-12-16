import type {
  BuiltinProviderNames,
  TokenData,
} from "@edgedb/auth-remix/server";
import { Octokit } from "@octokit/core";
import { client } from "~/services/auth.server";

export async function createUser(
  tokenData: TokenData,
  provider?: BuiltinProviderNames
) {
  let username: string | null = null;
  if (tokenData.provider_token && provider === "builtin::oauth_github") {
    const { data } = await new Octokit({
      auth: tokenData.provider_token,
    }).request("get /user");

    username = data.login;
  }
  await client.query(
    `
  with identity := (select ext::auth::Identity filter .id = <uuid>$identity_id),
  insert User {
    identity := identity,
    name := <optional str>$username ?? (
      select ext::auth::EmailFactor filter .identity = identity
    ).email
  } unless conflict on .identity`,
    {
      identity_id: tokenData.identity_id,
      username: username,
    }
  );
}

export function transformSearchParams(searchParams: URLSearchParams): {
  [key: string]: string | string[] | undefined;
} {
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    Object.assign(params, { [key]: value });
  }

  return params;
}
