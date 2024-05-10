CREATE MIGRATION m12hbwqzsf5dtxi5ehuacya4mg2ma3yn532po7x2mmcivtqoejnvwq
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.5';
  CREATE EXTENSION ai VERSION '1.0';
  CREATE TYPE default::Author {
      CREATE REQUIRED PROPERTY name: std::str;
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
