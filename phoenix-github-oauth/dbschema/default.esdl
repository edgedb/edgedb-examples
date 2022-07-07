module default {
  type User {
    property name -> str;
    required property username -> str;
    required property email -> str;

    property profile_tagline -> str;

    property avatar_url -> str;
    property external_homepage_url -> str;

    required property inserted_at -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }

    required property updated_at -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }

    index on (.email);
    index on (.username);
  }

  type Identity {
    required property provider -> str;
    required property provider_token -> str;
    required property provider_login -> str;
    required property provider_email -> str;
    required property provider_id -> str;

    required property provider_meta -> json {
      default := <json>"{}";
    }

    required property inserted_at -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }

    required property updated_at -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }

    required link user -> User {
      on target delete delete source;
    }

    index on (.provider);
    constraint exclusive on ((.user, .provider));
  }
}
