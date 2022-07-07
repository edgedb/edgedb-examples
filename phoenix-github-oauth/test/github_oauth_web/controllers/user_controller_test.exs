defmodule GitHubOAuthWeb.UserControllerTest do
  use GitHubOAuthWeb.ConnCase, async: false

  alias GitHubOAuth.AccountsFixtures

  describe "GET / when user not logged in" do
    test "redirects to GitHub authentication page", %{conn: conn} do
      response = get(conn, "/")
      assert redirected_to(response, 302) =~ "https://github.com/login/oauth/authorize"
    end
  end

  describe "GET / when user logged in" do
    setup [
      :setup_user,
      :setup_user_login
    ]

    test "returns user name in JSON response", %{conn: conn, user: %{name: name}} do
      response = get(conn, "/")
      assert %{"name" => ^name} = json_response(response, 200)
    end
  end

  defp setup_user(_tags) do
    user = AccountsFixtures.user_fixture(login: "testuser")
    %{user: user}
  end

  defp setup_user_login(%{conn: conn, user: user}) do
    conn =
      conn
      |> init_test_session(%{})
      |> put_session(:user_id, user.id)

    %{conn: conn}
  end
end
