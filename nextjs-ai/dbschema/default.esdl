using extension ai;

module default {
  type Author {
    required name: str {
      constraint exclusive;
    };
    books := .<author[is Book]
  }

  type Book {
    required title: str;
    required author: Author;
    required summary: str;
    deferred index ext::ai::index(embedding_model := 'text-embedding-3-small')
      on (.summary);
  }
}
