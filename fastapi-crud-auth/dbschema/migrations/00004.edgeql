CREATE MIGRATION m1oe66ebzkfe3pjwiq2yxr6pmfdp5ltnv3hdhzb5snicxaiz3yjvaq
    ONTO m1dubpo33vtnoby5ynceil2qir2rede56kfx5n2pmpgw7xob2p6k5q
{
  ALTER TYPE default::Event {
      ALTER LINK host {
          SET REQUIRED USING (SELECT
              default::User
          FILTER
              (.name = 'string')
          );
      };
  };
};
