module default {
  type BlogPost {
    required property title -> str;
    required property content -> str {
      default := ""
    };
  }
}
