module default {
  type Todo {
    required property text -> str;
    required property completed -> bool {
      default := false;
    }
  }
}
