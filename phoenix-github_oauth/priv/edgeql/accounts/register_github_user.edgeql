# edgedb = :query_single!
# mapper = GitHubOAuth.Accounts.User

with
  params := <json>$params,
  identities_params := params["identities"],
  user := (
    insert User {
      email := <str>params["email"],
      name := <str>params["name"],
      username := <str>params["username"],
      avatar_url := <optional str>json_get(params, "avatar_url"),
      external_homepage_url := <str>json_get(params, "external_homepage_url"),
    }
  ),
  identites := (
    for identity_params in json_array_unpack(identities_params) union (
      insert Identity {
        provider := <str>identity_params["provider"],
        provider_token := <str>identity_params["provider_token"],
        provider_email := <str>identity_params["provider_email"],
        provider_login := <str>identity_params["provider_login"],
        provider_id := <str>identity_params["provider_id"],
        provider_meta := <json>identity_params["provider_meta"],
        user := user,
      }
    )
  )
select user {
  id,
  name,
  username,
  email,
  avatar_url,
  external_homepage_url,
  inserted_at,
  updated_at,
  identities := identites,
}
