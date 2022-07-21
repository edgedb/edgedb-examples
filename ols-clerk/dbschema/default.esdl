module default {

  global current_user -> str;

  type User {
    required property clerk_id -> str { constraint exclusive };
    multi link posts := .<author[is BlogPost];
  }

  type BlogPost {
    required property title -> str;
    required link author -> User;
    access policy insert_posts allow insert;
    access policy own_posts allow select, delete, update using (
      .author ?= (select User filter .clerk_id ?= global current_user)
    );
  }
}
