CREATE MIGRATION m1jer2wyoe47tiwmf2tm75vl7fw6oapk2endloz2vkwsdwnb4ugavq
    ONTO m1zpyolps7fxv4762t3z7hbweosqefu6amqbmm66ogxefugo7xqnaq
{
  CREATE TYPE default::Exercise {
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::min_len_value(1);
      };
  };
};
