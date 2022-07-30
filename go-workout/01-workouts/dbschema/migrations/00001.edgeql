CREATE MIGRATION m1zpyolps7fxv4762t3z7hbweosqefu6amqbmm66ogxefugo7xqnaq
    ONTO initial
{
  CREATE TYPE default::Workout {
      CREATE REQUIRED PROPERTY started_at -> std::datetime {
          SET default := (std::datetime_current());
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
