CREATE MIGRATION m1gngnoor5yxft5nobkhc7plrzy7lgpecv2gcvxw6wa2xcg3e76sla
    ONTO m1zhhtjnse6muychjq5ikafibpd3chyh6a4nrv3kg7xadhrrm5hy7a
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
      CREATE PROPERTY height -> std::float32 {
          CREATE CONSTRAINT std::max_value(3.0);
          CREATE CONSTRAINT std::min_value(0.0);
      };
      CREATE PROPERTY is_deceased -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::max_len_value(50);
      };
  };
};
