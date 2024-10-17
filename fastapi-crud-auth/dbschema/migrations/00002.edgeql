CREATE MIGRATION m1o44fg65rqgafacgqgue2hlahzddj6ilapw6gmmgf6ckx56n7bxuq
    ONTO m1ztaehexxjhdnba7m7xbmdvmfeir6z37ehrnxkylg7obpdo6gqzfa
{
  ALTER TYPE default::Event {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::max_len_value(50);
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::max_len_value(50);
      };
  };
};
