# edgedb = :query_single!
# mapper = GitHubOAuth.Accounts.User

select User {
  id,
  name,
  username,
  email,
  avatar_url,
  external_homepage_url,
  inserted_at,
  updated_at,
}
filter .id = <uuid>$id
