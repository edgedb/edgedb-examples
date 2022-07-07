defmodule GitHubOAuth do
  @moduledoc """
  GitHubOAuth keeps the contexts that define your domain
  and business logic.
  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

  def config([main_key | rest] = keyspace) when is_list(keyspace) do
    main = Application.fetch_env!(:github_oauth, main_key)

    Enum.reduce(rest, main, fn next_key, current ->
      case Keyword.fetch(current, next_key) do
        {:ok, val} -> val
        :error -> raise ArgumentError, "no config found under #{inspect(keyspace)}"
      end
    end)
  end
end
