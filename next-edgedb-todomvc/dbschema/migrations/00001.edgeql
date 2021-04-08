CREATE MIGRATION m1qkebbv2osbdtvaniotmyet56omsoh3useiyh4sxohvlchqjcawia
    ONTO initial
{
  CREATE TYPE default::Task {
      CREATE REQUIRED PROPERTY completed -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY text -> std::str;
  };
};
