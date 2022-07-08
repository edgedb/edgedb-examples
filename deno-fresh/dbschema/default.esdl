module default {
  type Count {
    property created_at -> datetime {
      default := datetime_of_transaction();
    }
  };
}
