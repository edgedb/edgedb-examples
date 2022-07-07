defmodule GitHubOAuth.Accounts.Identity do
  use Ecto.Schema
  use EdgeDBEcto.Mapper

  import Ecto.Changeset

  alias GitHubOAuth.Accounts.{Identity, User}

  @github "github"

  @primary_key {:id, :binary_id, autogenerate: false}

  schema "default::Identity" do
    field :provider, :string
    field :provider_token, :string
    field :provider_email, :string
    field :provider_login, :string
    field :provider_name, :string, virtual: true
    field :provider_id, :string
    field :provider_meta, :map

    belongs_to :user, User

    timestamps()
  end

  def github_registration_changeset(info, primary_email, emails, token) do
    params = %{
      "provider_token" => token,
      "provider_id" => to_string(info["id"]),
      "provider_login" => info["login"],
      "provider_name" => info["name"] || info["login"],
      "provider_email" => primary_email
    }

    %Identity{}
    |> cast(params, [
      :provider_token,
      :provider_email,
      :provider_login,
      :provider_name,
      :provider_id
    ])
    |> put_change(:provider, @github)
    |> put_change(:provider_meta, %{"user" => info, "emails" => emails})
    |> validate_required([:provider_token, :provider_email, :provider_name, :provider_id])
  end
end
