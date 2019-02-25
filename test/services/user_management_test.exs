defmodule RemoteRetroWeb.UserManagementTest do
  use ExUnit.Case, async: false

  alias RemoteRetro.{User, Mailer}
  alias RemoteRetroWeb.{UserManagement}

  import Mock

  @google_user_map Application.get_env(:remote_retro, :test_user_one)

  # The syntax for with_mocks gets very bracey/bracketey, so we break the mock declarations
  # out into private helper methods, allowing us to spy on the stubbed functions within the test
  defp mock_deliver_now do
    {Mailer, [], [deliver_now: fn(_) -> %{} end]}
  end

  defp mock_upsert_record_from(inserted_or_updated \\ :inserted) do
    {User, [], [upsert_record_from: fn(oauth_info: _) ->
      mock_user = %User{email: "grant@me.com", given_name: "John Dillinger"}
      {:ok, mock_user, inserted_or_updated}
    end]}
  end

  describe ".handle_google_oauth" do
    test "it calls the user model's insert_or_update/1 func" do
      with_mocks [mock_deliver_now(), mock_upsert_record_from()] do
        UserManagement.handle_google_oauth(@google_user_map)

        assert_called User.upsert_record_from(oauth_info: %{})
      end
    end

    test "triggers an email when the user comes back as inserted" do
      with_mocks [mock_deliver_now(), mock_upsert_record_from(:inserted)] do
        {:ok, _user} = UserManagement.handle_google_oauth(@google_user_map)

        assert_called Mailer.deliver_now(%{})
      end
    end

    test "does *not* trigger an email when the user comes back as updated" do
      with_mocks [mock_deliver_now(), mock_upsert_record_from(:updated)] do
        {:ok, _user} = UserManagement.handle_google_oauth(@google_user_map)

        refute called(Mailer.deliver_now(%{}))
      end
    end
  end
end