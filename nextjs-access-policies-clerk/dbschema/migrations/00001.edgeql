CREATE MIGRATION m1lkipq7ps2z7jljzmbybxa5dkmu7sdoe5tsnhdze3x67rik45uj2q
    ONTO initial
{
  CREATE GLOBAL default::current_user -> std::str;
  CREATE TYPE default::BlogPost {
      CREATE ACCESS POLICY insert_posts
          ALLOW INSERT ;
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY clerk_id -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::BlogPost {
      CREATE REQUIRED LINK author -> default::User;
      CREATE ACCESS POLICY own_posts
          ALLOW SELECT, UPDATE, DELETE USING ((.author ?= (SELECT
              default::User
          FILTER
              (.clerk_id = GLOBAL default::current_user)
          )));
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK posts := (.<author[IS default::BlogPost]);
  };
};
