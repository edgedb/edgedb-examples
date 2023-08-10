 using extension pgvector;

    module default {
      scalar type OpenAIEmbedding extending
        ext::pgvector::vector<1536>;

      type Section {
        required path: str {
          constraint exclusive;
        }
        required content: str;
        required tokens: int16;
        required embedding: OpenAIEmbedding;

        index ext::pgvector::ivfflat_cosine(lists := 3)
          on (.embedding);
      }
    }