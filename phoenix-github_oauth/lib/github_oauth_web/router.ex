defmodule GitHubOAuthWeb.Router do
  use GitHubOAuthWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
  end

  scope "/", GitHubOAuthWeb do
    pipe_through :api

    get "/", UserController, :index
    get "/oauth/callbacks/:provider", OAuthCallbackController, :new
  end
end
