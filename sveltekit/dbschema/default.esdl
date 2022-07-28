module default {
  type Todo {
    required property created_at -> datetime {
      default := datetime_current();
    };
    required property created_by -> uuid;
    required property text -> str;
    required property done -> bool {
      default := false;
    };
  }
}
