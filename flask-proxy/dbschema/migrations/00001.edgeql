CREATE MIGRATION m1h3igynlyt4lrjxc7n4rg2gkndw4h2mqlq6baxs4usq6enfxstuja
    ONTO initial
{
  CREATE EXTENSION edgeql_http VERSION '1.0';
  CREATE EXTENSION graphql VERSION '1.0';
  CREATE REQUIRED GLOBAL default::admin_mode -> std::bool {
      SET default := false;
  };
  CREATE GLOBAL default::cur_username -> std::str;
  CREATE TYPE default::User {
      CREATE ACCESS POLICY admin_writes
          ALLOW ALL USING (GLOBAL default::admin_mode);
      CREATE REQUIRED PROPERTY username -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE ACCESS POLICY all_reads
          ALLOW SELECT USING (true);
  };
  CREATE TYPE default::Task {
      CREATE REQUIRED LINK owner -> default::User {
          SET default := (SELECT
              default::User
          FILTER
              (.username = GLOBAL default::cur_username)
          );
      };
      CREATE REQUIRED PROPERTY public -> std::bool {
          SET default := false;
      };
      CREATE ACCESS POLICY public_is_public
          ALLOW SELECT USING (.public);
      CREATE REQUIRED PROPERTY completed -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY text -> std::str;
  };
  ALTER TYPE default::User {
      CREATE LINK tasks := (.<owner[IS default::Task]);
  };
  CREATE GLOBAL default::cur_user := (SELECT
      default::User
  FILTER
      (.username = GLOBAL default::cur_username)
  );
  ALTER TYPE default::Task {
      CREATE ACCESS POLICY owner_controls
          ALLOW ALL USING ((.owner ?= GLOBAL default::cur_user));
  };
};
