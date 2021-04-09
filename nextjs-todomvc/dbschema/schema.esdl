
using extension edgeql_http;
using extension graphql;


module default {
  type Task {
    required property text -> str;
    required property completed -> bool{
      default := false;
    };
  }
};
