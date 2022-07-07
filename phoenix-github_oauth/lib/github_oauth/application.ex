defmodule GitHubOAuth.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start EdgeDB driver
      GitHubOAuth.EdgeDB,
      # Start the Telemetry supervisor
      GitHubOAuthWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: GitHubOAuth.PubSub},
      # Start the Endpoint (http/https)
      GitHubOAuthWeb.Endpoint
      # Start a worker by calling: GitHubOAuth.Worker.start_link(arg)
      # {GitHubOAuth.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: GitHubOAuth.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    GitHubOAuthWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
