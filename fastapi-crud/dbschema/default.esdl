module default {
  abstract type Auditable {
    annotation description := "Add 'created_at' property to all types.";
    required property created_at -> datetime {
      readonly := true;
      default := datetime_current();
    }
  }

  type User extending Auditable {
    annotation description := "Event host.";
    required property name -> str {
      constraint exclusive;
      constraint max_len_value(50);
    };
  }

  type Event extending Auditable {
    annotation description := "Some grand event.";
    required property name -> str {
      constraint exclusive;
      constraint max_len_value(50);
    }
    property address -> str;
    property schedule -> datetime;
    link host -> User;
  }
}
