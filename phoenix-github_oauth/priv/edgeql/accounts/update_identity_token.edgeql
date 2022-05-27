# edgedb = :query_required_single

with params := <json>$params
update Identity
filter .id = <uuid>params["id"]
set {
  provider_token := <str>json_get(params, "provider_token") ?? .provider_token,
  updated_at := cal::to_local_datetime(datetime_current(), 'UTC'),
}
