CREATE MIGRATION m1in6se2wuh4j53asdaxzchkohcxku45glusmlw6g4qvtfk55doceq
    ONTO m1vrfklpftt2s6epq2vgccmk5gvb546dlwf3zdtwdqs4bodtfdwwna
{

  # MCU data
  for name in {
    'Aaron Taylor-Johnson',
    'Alfred Molina',
    'Anthony Mackie',
    'Ben Kingsley',
    'Benedict Cumberbatch',
    'Benedict Wong',
    'Bokeem Woodbine',
    'Bradley Cooper',
    'Brie Larson',
    'Cate Blanchett',
    'Cate Shortland',
    'Chadwick Boseman',
    'Chris Eccleston',
    'Chris Evans',
    'Chris Hemsworth',
    'Chris Pratt',
    'Danai Durira',
    'Daniel Bruhl',
    'Dave Bautista',
    'Don Cheadle',
    'Elizabeth Olsen',
    'Evangeline Lilly',
    'Florence Pugh',
    'Guy Pearce',
    'Hugo Weaving',
    'Jake Gyllenhaal',
    'James Spader',
    'Jamie Foxx',
    'Jeremy Renner',
    'Jon Favreau',
    'Josh Brolin',
    'Jude Law',
    'Karen Gillan',
    'Kit Harington',
    'Kurt Russell',
    'Lee Pace',
    'Letitia Wright',
    'Mads Mikkelsen',
    'Mark Ruffalo',
    'Michael B. Jordan',
    'Michael Chernus',
    'Michael Keaton',
    'Michael Rooker',
    'Mickey Rourke',
    'Olga Kurylenko',
    'Paul Bettany',
    'Paul Rudd',
    'Pom Klementieff',
    'Hannah John-Kamen',
    'Ray Winstone',
    'Rhys Ifans',
    'Robert Downey Jr.',
    'Sam Rockwell',
    'Samuel L. Jackson',
    'Scarlett Johansson',
    'Sebastian Stan',
    'Simu Liu',
    'Tessa Thomson',
    'Thomas Haden Church',
    'Tim Roth',
    'Tom Hiddleston',
    'Tom Holland',
    'Vin Diesel',
    'Willem Dafoe',
    'Zoe Saldana'
  }
  union (insert default::Person {name := name});


  insert default::Movie {
    title := 'Ant-Man',
    release_year := 2015,
    actors := assert_distinct((
      for x in {
        ('Paul Rudd', 'Ant-Man')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Ant-Man and the Wasp',
    release_year := 2018,
    actors := assert_distinct((
      for x in {
        ('Evangeline Lilly', 'The Wasp'),
        ('Paul Rudd', 'Ant-Man'),
        ('Hannah John-Kamen', 'Ghost')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Avengers: Age of Ultron',
    release_year := 2015,
    actors := assert_distinct((
      for x in {
        ('Aaron Taylor-Johnson', 'Quicksilver'),
        ('Chris Evans', 'Captain America'),
        ('Chris Hemsworth', 'Thor'),
        ('Elizabeth Olsen', 'Scarlet Witch'),
        ('James Spader', 'Ultron'),
        ('Jeremy Renner', 'Hawkeye'),
        ('Mark Ruffalo', 'The Hulk'),
        ('Paul Bettany', 'Vision'),
        ('Robert Downey Jr.', 'Iron Man'),
        ('Samuel L. Jackson', 'Nick Fury'),
        ('Scarlett Johansson', 'Black Widow')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Avengers: Endgame',
    release_year := 2019,
    actors := assert_distinct((
      for x in {
        ('Anthony Mackie', 'The Falcon'),
        ('Benedict Cumberbatch', 'Doctor Strange'),
        ('Benedict Wong', 'Wong'),
        ('Bradley Cooper', 'Rocket'),
        ('Brie Larson', 'Captain Marvel'),
        ('Chadwick Boseman', 'Black Panther'),
        ('Chris Evans', 'Captain America'),
        ('Chris Hemsworth', 'Thor'),
        ('Chris Pratt', 'Star-Lord'),
        ('Danai Durira', 'Okoye'),
        ('Dave Bautista', 'Drax'),
        ('Don Cheadle', 'War Machine'),
        ('Elizabeth Olsen', 'Scarlet Witch'),
        ('Evangeline Lilly', 'The Wasp'),
        ('Jeremy Renner', 'Hawkeye'),
        ('Josh Brolin', 'Thanos'),
        ('Karen Gillan', 'Nebula'),
        ('Letitia Wright', 'Shuri'),
        ('Mark Ruffalo', 'The Hulk'),
        ('Paul Bettany', 'Vision'),
        ('Paul Rudd', 'Ant-Man'),
        ('Pom Klementieff', 'Mantis'),
        ('Robert Downey Jr.', 'Iron Man'),
        ('Scarlett Johansson', 'Black Widow'),
        ('Sebastian Stan', 'The Winter Soldier'),
        ('Tessa Thomson', 'Valkyrie'),
        ('Tom Hiddleston', 'Loki'),
        ('Tom Holland', 'Spider-Man'),
        ('Vin Diesel', 'Groot'),
        ('Zoe Saldana', 'Gamora')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Avengers: Infinity War',
    release_year := 2018,
    actors := assert_distinct((
      for x in {
        ('Anthony Mackie', 'The Falcon'),
        ('Benedict Cumberbatch', 'Doctor Strange'),
        ('Benedict Wong', 'Wong'),
        ('Bradley Cooper', 'Rocket'),
        ('Chadwick Boseman', 'Black Panther'),
        ('Chris Evans', 'Captain America'),
        ('Chris Hemsworth', 'Thor'),
        ('Chris Pratt', 'Star-Lord'),
        ('Danai Durira', 'Okoye'),
        ('Dave Bautista', 'Drax'),
        ('Don Cheadle', 'War Machine'),
        ('Elizabeth Olsen', 'Scarlet Witch'),
        ('Josh Brolin', 'Thanos'),
        ('Karen Gillan', 'Nebula'),
        ('Letitia Wright', 'Shuri'),
        ('Mark Ruffalo', 'The Hulk'),
        ('Paul Bettany', 'Vision'),
        ('Pom Klementieff', 'Mantis'),
        ('Robert Downey Jr.', 'Iron Man'),
        ('Scarlett Johansson', 'Black Widow'),
        ('Sebastian Stan', 'The Winter Soldier'),
        ('Tom Hiddleston', 'Loki'),
        ('Tom Holland', 'Spider-Man'),
        ('Vin Diesel', 'Groot'),
        ('Zoe Saldana', 'Gamora')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Black Panther',
    release_year := 2018,
    actors := assert_distinct((
      for x in {
        ('Chadwick Boseman', 'Black Panther'),
        ('Danai Durira', 'Okoye'),
        ('Letitia Wright', 'Shuri'),
        ('Michael B. Jordan', 'Killmonger')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Black Widow',
    release_year := 2021,
    actors := assert_distinct((
      for x in {
        ('Florence Pugh', 'Yelena Belova'),
        ('Olga Kurylenko', 'Taskmaster'),
        ('Ray Winstone', 'General Dreykov'),
        ('Scarlett Johansson', 'Black Widow')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Captain America: Civil War',
    release_year := 2016,
    actors := assert_distinct((
      for x in {
        ('Anthony Mackie', 'The Falcon'),
        ('Chadwick Boseman', 'Black Panther'),
        ('Chris Evans', 'Captain America'),
        ('Daniel Bruhl', 'Zemo'),
        ('Don Cheadle', 'War Machine'),
        ('Elizabeth Olsen', 'Scarlet Witch'),
        ('Jeremy Renner', 'Hawkeye'),
        ('Paul Bettany', 'Vision'),
        ('Paul Rudd', 'Ant-Man'),
        ('Robert Downey Jr.', 'Iron Man'),
        ('Samuel L. Jackson', 'Nick Fury'),
        ('Scarlett Johansson', 'Black Widow'),
        ('Sebastian Stan', 'The Winter Soldier'),
        ('Tom Holland', 'Spider-Man')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Captain America: The First Avenger',
    release_year := 2011,
    actors := assert_distinct((
      for x in {
        ('Chris Evans', 'Captain America'),
        ('Hugo Weaving', 'Red Skull')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Captain America: The Winter Soldier',
    release_year := 2014,
    actors := assert_distinct((
      for x in {
        ('Chris Evans', 'Captain America'),
        ('Samuel L. Jackson', 'Nick Fury'),
        ('Scarlett Johansson', 'Black Widow'),
        ('Sebastian Stan', 'The Winter Soldier')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Captain Marvel',
    release_year := 2019,
    actors := assert_distinct((
      for x in {
        ('Brie Larson', 'Captain Marvel'),
        ('Jude Law', 'Yon-Rogg'),
        ('Samuel L. Jackson', 'Nick Fury')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Doctor Strange',
    release_year := 2016,
    actors := assert_distinct((
      for x in {
        ('Benedict Cumberbatch', 'Doctor Strange'),
        ('Benedict Wong', 'Wong'),
        ('Mads Mikkelsen', 'Kaecilius')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Guardians of the Galaxy',
    release_year := 2014,
    actors := assert_distinct((
      for x in {
        ('Bradley Cooper', 'Rocket'),
        ('Chris Pratt', 'Star-Lord'),
        ('Dave Bautista', 'Drax'),
        ('Karen Gillan', 'Nebula'),
        ('Lee Pace', 'Ronin the Accuser'),
        ('Michael Rooker', 'Yondu'),
        ('Vin Diesel', 'Groot'),
        ('Zoe Saldana', 'Gamora')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Guardians of the Galaxy Vol. 2',
    release_year := 2017,
    actors := assert_distinct((
      for x in {
        ('Bradley Cooper', 'Rocket'),
        ('Chris Pratt', 'Star-Lord'),
        ('Dave Bautista', 'Drax'),
        ('Karen Gillan', 'Nebula'),
        ('Kurt Russell', 'Ego'),
        ('Michael Rooker', 'Yondu'),
        ('Pom Klementieff', 'Mantis'),
        ('Vin Diesel', 'Groot'),
        ('Zoe Saldana', 'Gamora')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Iron Man',
    release_year := 2008,
    actors := assert_distinct((
      for x in {
        ('Robert Downey Jr.', 'Iron Man')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Iron Man 2',
    release_year := 2010,
    actors := assert_distinct((
      for x in {
        ('Mickey Rourke', 'Whiplash'),
        ('Robert Downey Jr.', 'Iron Man'),
        ('Sam Rockwell', 'Justin Hammer'),
        ('Scarlett Johansson', 'Black Widow')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Iron Man 3',
    release_year := 2013,
    actors := assert_distinct((
      for x in {
        ('Ben Kingsley', 'The Mandarin'),
        ('Guy Pearce', 'Aldrich Killian'),
        ('Robert Downey Jr.', 'Iron Man')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Shang Chi and the Legend of the Ten Rings',
    release_year := 2021,
    actors := assert_distinct((
      for x in {
        ('Ben Kingsley', 'The Mandarin'),
        ('Simu Liu', 'Shang Chi')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Spider-Man: Far From Home',
    release_year := 2019,
    actors := assert_distinct((
      for x in {
        ('Jake Gyllenhaal', 'Mysterio'),
        ('Samuel L. Jackson', 'Nick Fury'),
        ('Tom Holland', 'Spider-Man')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Spider-Man: Homecoming',
    release_year := 2017,
    actors := assert_distinct((
      for x in {
        ('Bokeem Woodbine', 'Shocker'),
        ('Michael Chernus', 'Tinkerer'),
        ('Michael Keaton', 'The Vulture'),
        ('Robert Downey Jr.', 'Iron Man'),
        ('Tom Holland', 'Spider-Man')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Spider-Man: No Way Home',
    release_year := 2021,
    actors := assert_distinct((
      for x in {
        ('Alfred Molina', 'Doc Ock'),
        ('Benedict Cumberbatch', 'Doctor Strange'),
        ('Jamie Foxx', 'Electro'),
        ('Rhys Ifans', 'The Lizard'),
        ('Thomas Haden Church', 'Sandman'),
        ('Tom Holland', 'Spider-Man'),
        ('Willem Dafoe', 'Green Goblin')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'The Avengers',
    release_year := 2012,
    actors := assert_distinct((
      for x in {
        ('Chris Evans', 'Captain America'),
        ('Chris Hemsworth', 'Thor'),
        ('Jeremy Renner', 'Hawkeye'),
        ('Mark Ruffalo', 'The Hulk'),
        ('Robert Downey Jr.', 'Iron Man'),
        ('Scarlett Johansson', 'Black Widow'),
        ('Tom Hiddleston', 'Loki')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'The Incredible Hulk',
    release_year := 2008,
    actors := assert_distinct((
      for x in {
        ('Mark Ruffalo', 'The Hulk'),
        ('Tim Roth', 'Abomination')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Thor',
    release_year := 2010,
    actors := assert_distinct((
      for x in {
        ('Chris Hemsworth', 'Thor'),
        ('Tom Hiddleston', 'Loki')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Thor: Ragnarok',
    release_year := 2017,
    actors := assert_distinct((
      for x in {
        ('Cate Blanchett', 'Hela'),
        ('Chris Hemsworth', 'Thor'),
        ('Tessa Thomson', 'Valkyrie'),
        ('Tom Hiddleston', 'Loki')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Thor: The Dark World',
    release_year := 2013,
    actors := assert_distinct((
      for x in {
        ('Chris Eccleston', 'Malekith'),
        ('Chris Hemsworth', 'Thor'),
        ('Tom Hiddleston', 'Loki')
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  # More data to add old and new Dune, casts are incomplete, but we
  # mainly want some overlapping characters, and Patrick Stewart
  # who will also appear in default::Show (TNG).
  for name in {
    'Timothée Chalamet',
    'Rebecca Ferguson',
    'Oscar Isaac',
    'Jason Momoa',
    'Kyle MacLachlan',
    'Virginia Madsen',
    'Francesca Annis',
    'Richard Jordan',
    'Jürgen Prochnow',
    'Patrick Stewart',
    'Sean Young',
    'Zendaya',
    'Sting',
  }
  union (insert default::Person {name := name});


  insert default::Movie {
    title := 'Dune',
    release_year := 1984,
    actors := assert_distinct((
      for x in {
        ('Kyle MacLachlan', 'Paul Atreides'),
        ('Virginia Madsen', 'Princess Irulan'),
        ('Francesca Annis', 'Lady Jessica'),
        ('Richard Jordan', 'Duncan Idaho'),
        ('Jürgen Prochnow', 'Duke Leto Atreides'),
        ('Patrick Stewart', 'Gurney Halleck'),
        ('Sean Young', 'Chani'),
        ('Sting', 'Feyd Rautha'),
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  insert default::Movie {
    title := 'Dune',
    release_year := 2021,
    actors := assert_distinct((
      for x in {
        ('Timothée Chalamet', 'Paul Atreides'),
        ('Rebecca Ferguson', 'Lady Jessica Atreides'),
        ('Zendaya', 'Chani'),
        ('Oscar Isaac', 'Duke Leto Atreides'),
        ('Jason Momoa', 'Duncan Idaho'),
        ('Josh Brolin', 'Gurney Halleck'),
      }
      union (
        select default::Person {
          char_name := x.1
        } filter .name = x.0
      )
    )) {@character_name := .char_name}
  };


  # Add a couple of last seasons of TNG and a few actors from them,
  # mainly Patrick Stewart should be re-used so that there's at least
  # someone who appears in both a default::Movie and a default::Show.
  for name in {
    'Jonathan Frakes',
    'Brent Spiner',
    'Gates McFadden',
    'LeVar Burton',
    'Marina Sirtis',
    'Michael Dorn',
  }
  union (insert default::Person {name := name});


  with show := (
    insert default::Show {
      title := 'Star Trek: The Next Generation',
      actors := assert_distinct((
        for x in {
          ('Patrick Stewart', 'Captain Jean-Luc Picard'),
          ('Jonathan Frakes', 'Commander William T. Riker'),
          ('Brent Spiner', 'Lt. Cmdr. Data'),
          ('Gates McFadden', 'Dr. (Cmdr.) Beverly Crusher'),
          ('LeVar Burton', 'Lt. Cmdr. Geordi La Forge'),
          ('Marina Sirtis', 'Counselor (Lt. Cmdr.) Deanna Troi'),
          ('Michael Dorn', 'Lt. Worf'),
        }
        union (
          select default::Person {
            char_name := x.1
          } filter .name = x.0
        )
      )) {@character_name := .char_name}
    }
  )
  for n in {1, 2, 3, 4, 5, 6, 7}
  union (
    insert default::Season {
      number := n,
      show := show,
    }
  );


  # Finally add a few of user accounts.
  insert default::Account {
    username := 'Alice',
    watchlist := (
      select Content
      filter .title ilike 'Thor%' or .title ilike '%Spider%'
    ),
  };


  insert default::Account {
    username := 'Billie',
    watchlist := (
      select Content
      filter .title ilike 'Dune'
    ),
  };


  insert default::Account {
    username := 'Cameron',
    watchlist := (
      select Content
      filter .actors.name in {'Josh Brolin', 'Patrick Stewart'}
    ),
  };


  insert default::Account {
    username := 'Dana',
    # no watchlist
  };

};