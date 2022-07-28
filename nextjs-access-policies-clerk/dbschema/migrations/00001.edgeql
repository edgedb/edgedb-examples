CREATE MIGRATION m1enig2ckrp5rhrjh2r6bdjp6ozmbyzp3n5ootq7mzvpn7xjzlzyna
    ONTO initial
{
  CREATE TYPE default::BlogPost {
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY clerk_id -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
