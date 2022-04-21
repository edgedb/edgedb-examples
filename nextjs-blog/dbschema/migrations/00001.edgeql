CREATE MIGRATION m1s44oki2aihkslwj4zpxl6464fxqxcdafbtp23ch6bffuwsrnu2za
    ONTO initial
{
  CREATE TYPE default::BlogPost {
      CREATE REQUIRED PROPERTY content -> std::str;
      CREATE PROPERTY publishedAt -> std::datetime;
      CREATE REQUIRED PROPERTY title -> std::str;
  };
};
