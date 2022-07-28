CREATE MIGRATION m1m64sdjz2lvcla6w3as4cwo7orqkhj4avxw4qzfyemfoczqfpomsa
    ONTO initial
{
  CREATE TYPE default::Todo {
      CREATE REQUIRED PROPERTY created_at -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY created_by -> std::uuid;
      CREATE REQUIRED PROPERTY done -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY text -> std::str;
  };
};
