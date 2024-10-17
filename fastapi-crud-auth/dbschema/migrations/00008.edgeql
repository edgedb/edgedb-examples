CREATE MIGRATION m1iql6m25k74sq2o4432ettotupltggdib5q7b54svxzcfycfi3xia
    ONTO m12kcgdxpnqoh7uekkvmp3wvhhqwod3qyz7psn7y5wtne3wln6yefa
{
  ALTER TYPE default::Auditable {
      ALTER ANNOTATION std::description := "Add 'created_at' property to all types.";
      ALTER PROPERTY created_at {
          SET REQUIRED USING (std::datetime_current());
      };
  };
};
