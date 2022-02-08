CREATE MIGRATION m132356m4a3mcu7u4gy2vhhsmec3pkdf6s76ana2jwnovppbxl6rjq
    ONTO initial
{
  CREATE TYPE default::Todo {
      CREATE REQUIRED PROPERTY completed -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY text -> std::str;
  };
};
