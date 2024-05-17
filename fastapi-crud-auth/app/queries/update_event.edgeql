with current_name := <str>$current_name,
    new_name := <str>$name,
    address := <str>$address,
    schedule := <str>$schedule,
    host_name := <str>$host_name

select (
    update Event filter .name = current_name
    set {
        name := new_name,
        address := address,
        schedule := <datetime>schedule,
        host := (select User filter .name = host_name)
    }
) {name, address, schedule, host: {name}};
