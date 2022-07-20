import {client, e} from '../client';

const userData = [
  {
    name: 'Alice',
    email: 'alice@edgedb.com',
    posts: [
      {
        title: 'Join the EdgeDB Discord',
        content: 'https://discord.gg/edgedb',
        published: true,
      },
    ],
  },
  {
    name: 'Nilu',
    email: 'nilu@edgedb.com',
    posts: [
      {
        title: 'Follow EdgeDB on Twitter',
        content: 'https://www.twitter.com/edgedatabase',
        published: true,
      },
    ],
  },
  {
    name: 'Colin',
    email: 'colin@edgedb.com',
    posts: [
      {
        title: 'Ask a question about EdgeDB on GitHub',
        content: 'https://www.github.com/edgedb/edgedb/discussions',
        published: true,
      },
      {
        title: 'EdgeDB on YouTube',
        content: 'https://www.youtube.com/c/EdgeDB',
        published: false,
      },
    ],
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const u of userData) {
    const newUser = await e
      .insert(e.User, {
        name: u.name,
        email: u.email,
      })
      .run(client);

    const posts = u.posts.map((post) =>
      e.insert(e.Post, {
        ...post,
        author: e.select(e.User, (user) => ({
          filter: e.op(user.id, '=', e.uuid(newUser.id)),
        })),
      })
    );
    await e.set(...posts).run(client);
    console.log(`Created user ${newUser.id}`);
  }
  console.log(`Seeding finished.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
