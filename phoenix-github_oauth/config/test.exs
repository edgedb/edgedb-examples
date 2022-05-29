import Config

config :github_oauth, :github,
  client_id: "client_id",
  client_secret: "client_secret"

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :github_oauth, GitHubOAuthWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "CmJqi1WR3Gw1LknePvA7hwXMshhziwyBsmAK/t4IGQFzztfesMqhiYhdlSgYZZkj",
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

config :edgedb,
  connection: EdgeDB.Sandbox
