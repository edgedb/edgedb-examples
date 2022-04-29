CREATE MIGRATION m1fee6oypqpjrreleos5hmivgfqg6zfkgbrowx7sw5jvnicm73hqdq
    ONTO initial
{
  CREATE TYPE default::BlogPost {
      CREATE REQUIRED PROPERTY content -> std::str {
          SET default := '';
      };
      CREATE REQUIRED PROPERTY title -> std::str;
  };
};
