CREATE MIGRATION m15hmmrq3zkv4li73rflck5zjoopld5hl5ehcppf5lh5gxdoqmrtba
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.5';
  CREATE EXTENSION ai VERSION '1.0';
  CREATE TYPE default::Author {
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Book {
      CREATE REQUIRED LINK author: default::Author;
      CREATE REQUIRED PROPERTY summary: std::str;
      CREATE DEFERRED INDEX ext::ai::index(embedding_model := 'text-embedding-3-small') ON (.summary);
      CREATE REQUIRED PROPERTY title: std::str;
  };
  ALTER TYPE default::Author {
      CREATE LINK books := (.<author[IS default::Book]);
  };
};
