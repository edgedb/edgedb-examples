CREATE MIGRATION m1kfcgk2amm2daild6mzcfjqmrk5wqwotvmxphze5x7fpf7fwcvtwa
    ONTO m1h4u4dofpaxsi2guowyqnssoebuno5xjenx7arhbkix4xutraolxq
{
  CREATE TYPE default::Count {
      CREATE PROPERTY created_at -> std::datetime {
          SET default := (std::datetime_of_transaction());
      };
  };
  DROP SCALAR TYPE default::counter;
};
