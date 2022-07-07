defmodule GitHubOAuth.EdgeDB do
  use EdgeDBEcto,
    name: __MODULE__,
    queries: true,
    otp_app: :github_oauth

  def child_spec(_opts \\ []) do
    %{
      id: __MODULE__,
      start: {EdgeDB, :start_link, [[name: __MODULE__]]}
    }
  end
end
