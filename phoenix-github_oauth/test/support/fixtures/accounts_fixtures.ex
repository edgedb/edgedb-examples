defmodule GitHubOAuth.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `GitHubOAuth.Accounts` context.
  """

  def unique_user_email, do: "user#{System.unique_integer()}@example.com"

  def user_fixture(attrs \\ %{}) do
    primary_email = attrs[:email] || unique_user_email()

    info = %{
      "login" => attrs[:username] || "github_oauth_test_username",
      "avatar_url" => nil,
      "html_url" => nil,
      "name" => attrs[:name] || "GitHub OAuth Test",
      "id" => 1
    }

    emails = []
    token = "token"

    {:ok, user} = GitHubOAuth.Accounts.register_github_user(primary_email, info, emails, token)

    user
  end
end
