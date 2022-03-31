CREATE MIGRATION m1prjlzk6hbd3lutbny63ogirg4yukcclr5vcz5g7lkelnveorfjla
    ONTO initial
{
  CREATE TYPE default::Post {
      CREATE PROPERTY content -> std::str;
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY published -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY title -> std::str;
      CREATE REQUIRED PROPERTY viewCount -> std::int64 {
          SET default := 0;
      };
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK posts -> default::Post;
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY name -> std::str;
  };
  ALTER TYPE default::Post {
      CREATE LINK author -> default::User;
  };
};
