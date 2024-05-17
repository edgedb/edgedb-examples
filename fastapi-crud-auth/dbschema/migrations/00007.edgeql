CREATE MIGRATION m12kcgdxpnqoh7uekkvmp3wvhhqwod3qyz7psn7y5wtne3wln6yefa
    ONTO m16r77gz27jqnlos6std4s2ich5ecmxkidbe5vrel2jef23trmtpia
{
  ALTER TYPE default::Auditable {
      ALTER PROPERTY created_at {
          SET readonly := true;
      };
  };
};
