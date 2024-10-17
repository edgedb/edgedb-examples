CREATE MIGRATION m1dubpo33vtnoby5ynceil2qir2rede56kfx5n2pmpgw7xob2p6k5q
    ONTO m1o44fg65rqgafacgqgue2hlahzddj6ilapw6gmmgf6ckx56n7bxuq
{
  ALTER TYPE default::User {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
