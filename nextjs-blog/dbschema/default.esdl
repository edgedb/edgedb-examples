module default {
  
  type BlogPost {
    required property title -> str {
      default := 'Untitled'
    }
    required property content -> str {
      default := ''
    };
    property publishedAt -> datetime;
  }

}
