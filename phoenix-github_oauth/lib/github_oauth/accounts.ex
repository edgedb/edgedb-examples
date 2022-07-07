defmodule GitHubOAuth.Accounts do
  import Ecto.Changeset

  alias GitHubOAuth.Accounts.{User, Identity}

  def get_user(id) do
    GitHubOAuth.EdgeDB.Accounts.get_user_by_id(id: id)
  end

  def register_github_user(primary_email, info, emails, token) do
    if user = get_user_by_provider(:github, primary_email) do
      update_github_token(user, token)
    else
      info
      |> User.github_registration_changeset(primary_email, emails, token)
      |> EdgeDBEcto.insert(&GitHubOAuth.EdgeDB.Accounts.register_github_user/1, nested: true)
    end
  end

  def get_user_by_provider(provider, email) when provider in [:github] do
    GitHubOAuth.EdgeDB.Accounts.get_user_by_provider(
      provider: to_string(provider),
      email: String.downcase(email)
    )
  end

  defp update_github_token(%User{} = user, new_token) do
    identity =
      GitHubOAuth.EdgeDB.Accounts.get_identity_for_user(user_id: user.id, provider: "github")

    {:ok, _} =
      identity
      |> change()
      |> put_change(:provider_token, new_token)
      |> EdgeDBEcto.update(&GitHubOAuth.EdgeDB.Accounts.update_identity_token/1)

    {:ok, %User{user | identities: [%Identity{identity | provider_token: new_token}]}}
  end
end
