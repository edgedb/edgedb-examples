select (
    update User filter .name = <str>$current_name
    set {name := <str>$new_name}
) {name, created_at};
