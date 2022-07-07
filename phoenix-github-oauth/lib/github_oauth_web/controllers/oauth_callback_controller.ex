defmodule GitHubOAuthWeb.OAuthCallbackController do
  use GitHubOAuthWeb, :controller

  alias GitHubOAuth.Accounts

  require Logger

  def new(conn, %{"provider" => "github", "code" => code, "state" => state}) do
    client = github_client(conn)

    with {:ok, info} <- client.exchange_access_token(code: code, state: state),
         %{info: info, primary_email: primary, emails: emails, token: token} = info,
         {:ok, user} <- Accounts.register_github_user(primary, info, emails, token) do
      conn
      |> log_in_user(user)
      |> redirect(to: "/")
    else
      {:error, %Ecto.Changeset{} = changeset} ->
        Logger.debug("failed GitHub insert #{inspect(changeset.errors)}")

        json(conn, %{
          error: "We were unable to fetch the necessary information from your GitHub account"
        })

      {:error, reason} ->
        Logger.debug("failed GitHub exchange #{inspect(reason)}")
        json(conn, %{error: "We were unable to contact GitHub. Please try again later"})
    end
  end

  def new(conn, %{"provider" => "github", "error" => "access_denied"}) do
    json(conn, %{error: "Access denied"})
  end

  defp github_client(conn) do
    conn.assigns[:github_client] || GitHubOAuth.GitHub
  end

  defp log_in_user(conn, user) do
    conn
    |> assign(:current_user, user)
    |> configure_session(renew: true)
    |> clear_session()
    |> put_session(:user_id, user.id)
  end
end
