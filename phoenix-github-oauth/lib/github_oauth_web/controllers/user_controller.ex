defmodule GitHubOAuthWeb.UserController do
  use GitHubOAuthWeb, :controller

  alias GitHubOAuth.Accounts

  plug :fetch_current_user

  def index(conn, _params) do
    if conn.assigns.current_user do
      json(conn, %{name: conn.assigns.current_user.name})
    else
      redirect(conn, external: GitHubOAuth.GitHub.authorize_url())
    end
  end

  defp fetch_current_user(conn, _opts) do
    user_id = get_session(conn, :user_id)
    user = user_id && Accounts.get_user(user_id)
    assign(conn, :current_user, user)
  end
end
