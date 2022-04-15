module default {
  abstract type AuditLog {
    annotation description := "Add 'create_at' and 'update_at' properties to all types.";
    property created_at -> datetime {
      default := datetime_current();
    }
  }

  type User extending AuditLog {
    annotation description := "Event host.";
    required property name -> str {
      constraint max_len_value(50);
    };
  }

  type Event extending AuditLog {
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
