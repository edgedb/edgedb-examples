module default {
  abstract type Auditable {
    annotation description := "Add 'create_at' properties to all types.";
    property created_at -> datetime {
      readonly := true;
      default := datetime_current();
    }
  }

  type Actor extending Auditable {
    annotation description := "Movie actors.";
    required property name -> str {
      constraint max_len_value(50);
    }
    property age -> int16 {
      constraint min_value(0);
      constraint max_value(100);
    }
    property height -> int16 {
      constraint min_value(0);
      constraint max_value(300);
    }
  }

  type Movie extending Auditable {
    annotation description := "Marvel movies.";
    required property name -> str {
      constraint max_len_value(50);
    }
    property year -> int16{
      constraint min_value(1850);
    };
    multi link actors -> Actor;
  }
}
