select (
    delete Event filter .name = <str>$name
) {name, address, schedule, host : {name}};
