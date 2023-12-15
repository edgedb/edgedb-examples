CREATE MIGRATION m1ybrsc7aeu7w44f3x5jyzatdykxgj3jbtn7zzkavewfycgapm5hla
    ONTO m1pht25sdxgo7tw3loovimnppi7v6schpwpp2moqirw2seuib66r6a
{
  ALTER TYPE default::User {
      ALTER LINK identity {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY name: std::str;
  };
  CREATE GLOBAL default::currentUser := (SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  );
  CREATE TYPE default::Todo {
      CREATE REQUIRED LINK owner: default::User {
          SET default := (GLOBAL default::currentUser);
      };
      CREATE ACCESS POLICY ownerHasAccess
          ALLOW ALL USING ((GLOBAL default::currentUser ?= .owner));
      CREATE REQUIRED PROPERTY completed: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY created_on: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
