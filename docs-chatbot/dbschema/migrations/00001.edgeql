CREATE MIGRATION m1yyvsjcusq5fnhgr7lx64omtbhs7uhow2y35wpo4gi5ajfiynjs4a
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.4';
  CREATE SCALAR TYPE default::OpenAIEmbedding EXTENDING ext::pgvector::vector<1536>;
  CREATE TYPE default::Section {
      CREATE REQUIRED PROPERTY embedding: default::OpenAIEmbedding;
      CREATE INDEX ext::pgvector::ivfflat_cosine(lists := 3) ON (.embedding);
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY tokens: std::int16;
  };
};
