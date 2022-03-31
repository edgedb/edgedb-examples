module default {  
  
  type User {
    required property email -> str {
      constraint exclusive;
    }
    property name -> str;
    multi link posts := .<author[is Post];
  }

  type Post {
    required property createdAt -> datetime { default := datetime_of_transaction(); };
    required property title -> str;
    property content -> str;
    required property published -> bool { default := false; };
    required property viewCount -> int64 { default := 0 };
    link author -> User;
  }

}