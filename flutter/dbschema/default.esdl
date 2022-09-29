module default {
  abstract type Content {
    required property title -> str;
    multi link actors -> Person {
      property character_name -> str;
    };
  };

  type Person {
    required property name -> str;
    link filmography := .<actors[is Content];
  };

  type Movie extending Content {
    property release_year -> int32;
  };

  type Show extending Content {
    property num_seasons := count(.<show[is Season]);
  };

  type Season {
    required link show -> Show;
    required property number -> int32;
  };

  type Account {
    required property username -> str {
      constraint exclusive;
    };
    multi link watchlist -> Content;
  };
}
