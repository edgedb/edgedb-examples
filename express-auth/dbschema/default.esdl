using extension auth;

module default {
  type User {
    required identity: ext::auth::Identity;
  }
}
