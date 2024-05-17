select Event {
    name, address, schedule,
    host : {name}
} filter .name=<str>$name;
