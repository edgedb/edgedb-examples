CREATE MIGRATION m1ucy6ihbabrkhyvgafxmyzqnkpx4pdvmvyb6pyqgp6a6gw3bsgmeq
    ONTO initial
{
  CREATE ABSTRACT TYPE default::Auditable {
      CREATE PROPERTY created_at -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE ANNOTATION std::description := "Add 'create_at' properties to all types.";
  };
  CREATE TYPE default::Actor EXTENDING default::Auditable {
      CREATE ANNOTATION std::description := 'Movie actors.';
      CREATE PROPERTY age -> std::int16 {
          CREATE CONSTRAINT std::max_value(100);
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE PROPERTY height -> std::int16 {
          CREATE CONSTRAINT std::max_value(300);
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::max_len_value(50);
      };
  };
  CREATE TYPE default::Movie EXTENDING default::Auditable {
      CREATE MULTI LINK actors -> default::Actor;
      CREATE ANNOTATION std::description := 'Marvel movies.';
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::max_len_value(50);
      };
      CREATE PROPERTY year -> std::int16 {
          CREATE CONSTRAINT std::min_value(1850);
      };
  };
};
