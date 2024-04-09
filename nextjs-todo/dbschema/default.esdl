module default {
  type Task {
    required text: str;
    required completed: bool {
      default := false;
    };
  }
};
