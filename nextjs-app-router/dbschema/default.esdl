module default {
  type BlogPost {
    required title: str;
    required content: str {
      default := ""
    }
  }
}
