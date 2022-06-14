CREATE MIGRATION m12ilkzpnx7o2ty7jdicydrazksndmswg7sqgwp6q7wnm5evgnc5ua
    ONTO m1gngnoor5yxft5nobkhc7plrzy7lgpecv2gcvxw6wa2xcg3e76sla
{
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          DROP CONSTRAINT std::max_value(3.0);
      };
  };
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          CREATE CONSTRAINT std::max_value(300);
      };
  };
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          DROP CONSTRAINT std::min_value(0.0);
      };
  };
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          CREATE CONSTRAINT std::min_value(0);
      };
  };
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          SET TYPE std::int16 USING ((<std::int16>.height * 100));
      };
  };
};
