CREATE MIGRATION m1bkdl72eirg2szj3yzalryegdmzlqpncdh5wo5l35xcyqv7tyslhq
    ONTO m12hbwqzsf5dtxi5ehuacya4mg2ma3yn532po7x2mmcivtqoejnvwq
{
  ALTER TYPE default::Author {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
