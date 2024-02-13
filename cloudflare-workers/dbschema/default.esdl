module default {
  type Movie {
    required title: str {
      constraint exclusive;
    };
    multi actors: Person;
  }

  type Person {
    required name: str;
  }
}