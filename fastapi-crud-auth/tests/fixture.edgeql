insert User {name := 'Jonathan Harker'};
insert User {name := 'Count Dracula'};
insert User {name := 'Mina Murray'};
insert Event {
  name := 'Resuscitation',
  host := (select User filter .name = 'Mina Murray'),
  address := 'Britain',
  schedule := <datetime>'1889-07-28T06:59:59+00:00'
};
