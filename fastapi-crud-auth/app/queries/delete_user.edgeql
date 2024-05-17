select (
    delete User filter .name = <str>$name
) {name, created_at};
