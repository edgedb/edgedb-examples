import { createClient } from "edgedb";

const client = createClient();

async function main() {
  await client.query(`
# Database Config

## Reset config
configure current branch reset ext::ai::ProviderConfig;

## AI config
configure current branch insert ext::ai::OpenAIProviderConfig {
  secret := "${process.env.OPENAI_SECRET}",
};

## CORS config
configure current branch set cfg::cors_allow_origins := {"*"};
`);

  await client.query(`
delete Book;
delete Author;`);

  await client.query(
    `
with
    books := <array<tuple<author_name: str, title: str, summary: str>>>$books,
    authors := (
      for name in (distinct array_unpack(books).author_name)
      insert Author {
        name := name,
      }
    ),
for book in array_unpack(books)
insert Book {
  title := book.title,
  summary := book.summary,
  author := assert_exists((
    select authors
    filter .name = book.author_name
  )),
};
  `,
    {
      books: [
        {
          author_name: "Elara Thornwood",
          title: "Whispers of the Forgotten",
          summary:
            "An enchanting tale of a hidden village that exists between the folds of time, where the forgotten are remembered.",
        },
        {
          author_name: "Milo Vesper",
          title: "Echoes of the Void",
          summary:
            "A cosmic adventure across starlit galaxies to uncover the mysteries of a universe humming with the echo of ancient civilizations.",
        },
        {
          author_name: "Sylvia Quill",
          title: "The Last Alchemist",
          summary:
            "In a world drained of magic, the last alchemist undertakes a quest to reignite the lost sparks of enchantment.",
        },
        {
          author_name: "Finn Barlow",
          title: "Beneath the Drifts",
          summary:
            "A chilling expedition beneath the ice where darkness unveils not just secrets, but a dormant, sinister will.",
        },
        {
          author_name: "Lysandra Vale",
          title: "The Gilded Mirror",
          summary:
            "A cursed mirror reflects alternative realities, trapping its viewers in a labyrinth of their potential lives.",
        },
        {
          author_name: "Caspian Rook",
          title: "The Clockmaker’s Paradox",
          summary:
            "A clockmaker in a steampunk city discovers a time paradox that could unravel the very fabric of existence.",
        },
        {
          author_name: "Ariadne Thread",
          title: "The Maze of Many",
          summary:
            "A labyrinth with doors leading to infinite worlds becomes a battleground for those seeking ultimate power.",
        },
        {
          author_name: "Orion Ember",
          title: "Ashes of the Starry Sea",
          summary:
            "After the stars in the sky mysteriously vanish, a band of astronomers embark on a perilous journey to retrieve them.",
        },
        {
          author_name: "Seraphine Bright",
          title: "Whispering Flames",
          summary:
            "In a realm where fire speaks and the ashes tell tales, a young fire whisperer must save her people from an eternal blaze.",
        },
        {
          author_name: "Thorne Blackwood",
          title: "Nightshade’s Promise",
          summary:
            "A forbidden forest filled with nightshade flowers promises eternal youth, but at a price that could be too perilous.",
        },
      ],
    }
  );

  console.log(await client.query("select Book {**};"));
}

main();