using extension edgeql_http;
using extension graphql;

module default {
  global cur_username -> str;
  global cur_user := (select User filter .username = global cur_username);
  required global admin_mode -> bool {
    default := false;
  }

  type User {
    required property username -> str {
      constraint exclusive;
    }
    link tasks := .<owner[IS Task];

    # Users can only be created and modified by admin endpoints
    access policy admin_writes
      allow all using (global admin_mode);

    # The user list is public (for demo simplicity; you could do a
    # friends model!)
    access policy all_reads
      allow select using (true);
  }

  type Task {
    required link owner -> User {
      default := (select User filter .username = global cur_username)
    };

    required property text -> str;
    required property completed -> bool {
      default := false;
    };
    required property public -> bool {
      default := false;
    };

    # Task can only be modified and created by their owners, and can
    # be read by their owners
    access policy owner_controls
      allow all using (.owner ?= global cur_user);
    # And can also be viewed by anyone if they are public
    access policy public_is_public
      allow select using (.public);
  }
};
