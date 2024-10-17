CREATE MIGRATION m1ztaehexxjhdnba7m7xbmdvmfeir6z37ehrnxkylg7obpdo6gqzfa
    ONTO initial
{
  CREATE ABSTRACT TYPE default::AuditLog {
      CREATE ANNOTATION std::description := "Add 'create_at' and 'update_at' properties to all types.";
      CREATE PROPERTY created_at -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  CREATE TYPE default::User EXTENDING default::AuditLog {
      CREATE ANNOTATION std::description := 'Event host.';
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE default::Event EXTENDING default::AuditLog {
      CREATE ANNOTATION std::description := 'Some grand event.';
      CREATE LINK host -> default::User;
      CREATE PROPERTY address -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY schedule -> std::datetime;
  };
};
