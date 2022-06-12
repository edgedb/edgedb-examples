CREATE MIGRATION m1jpdkambyjpwefvdkwxk6zanbokogphprdhs2qwv3l4n5kw5qkqbq
    ONTO m14b765mvq3pe2xibazda2o37bmoze3dap3v2v3srozyzamhlrpika
{
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          CREATE CONSTRAINT std::max_value(3.0);
      };
  };
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          DROP CONSTRAINT std::max_value(300);
      };
  };
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          CREATE CONSTRAINT std::min_value(0.0);
      };
  };
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          DROP CONSTRAINT std::min_value(0);
      };
  };
  ALTER TYPE default::Actor {
      ALTER PROPERTY height {
          SET TYPE std::float32;
      };
  };
};
