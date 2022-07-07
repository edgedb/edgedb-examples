CREATE MIGRATION m1yehm3jhj6jqwguelek54jzp4wqvvqgrcnvncxwb7676ult7nmcta
    ONTO initial
{
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY username -> std::str;
      CREATE INDEX ON (.username);
      CREATE REQUIRED PROPERTY email -> std::str;
      CREATE INDEX ON (.email);
      CREATE PROPERTY avatar_url -> std::str;
      CREATE PROPERTY external_homepage_url -> std::str;
      CREATE REQUIRED PROPERTY inserted_at -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
      CREATE PROPERTY name -> std::str;
      CREATE PROPERTY profile_tagline -> std::str;
      CREATE REQUIRED PROPERTY updated_at -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
  };
  CREATE TYPE default::Identity {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE  DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY provider -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.user, .provider));
      CREATE INDEX ON (.provider);
      CREATE REQUIRED PROPERTY inserted_at -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
      CREATE REQUIRED PROPERTY provider_email -> std::str;
      CREATE REQUIRED PROPERTY provider_id -> std::str;
      CREATE REQUIRED PROPERTY provider_login -> std::str;
      CREATE REQUIRED PROPERTY provider_meta -> std::json {
          SET default := (<std::json>'{}');
      };
      CREATE REQUIRED PROPERTY provider_token -> std::str;
      CREATE REQUIRED PROPERTY updated_at -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
  };
};
