 using extension pgvector;

    module default {
      scalar type OpenAIEmbedding extending
        ext::pgvector::vector<1536>;

      type Section {
        required content: str;
        required tokens: int16;
        required embedding: OpenAIEmbedding;

        index ext::pgvector::ivfflat_cosine(lists := 1)
          on (.embedding);
      }
    }