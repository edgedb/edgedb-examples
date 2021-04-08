module default {
  type Task {
    required property text -> str;
    required property completed -> str{
      default := false;
    };
  }

  type Person {
    required property first_name -> str;
    required property last_name -> str;
  }
  
  type Movie {
    required property title -> str;
    # the year of release
    property year -> int64;
    required link director -> Person;
    multi link actors -> Person;
  }
};
