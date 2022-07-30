CREATE MIGRATION m1lqjpwr4gqwe4sqqyxqmmyabsqizatbktfv6ybjoih5ykuhd73fwa
    ONTO m1jer2wyoe47tiwmf2tm75vl7fw6oapk2endloz2vkwsdwnb4ugavq
{
  CREATE SCALAR TYPE default::SetIndex EXTENDING std::sequence;
  CREATE TYPE default::Set_ {
      CREATE REQUIRED LINK exercise -> default::Exercise;
      CREATE REQUIRED PROPERTY index -> default::SetIndex {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY reps -> std::int16 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY weight -> std::float32;
  };
  ALTER TYPE default::Workout {
      CREATE MULTI LINK sets -> default::Set_ {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
