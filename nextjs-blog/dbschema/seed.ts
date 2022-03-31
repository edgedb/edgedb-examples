import {client, e} from '../client';

const userData = [
  {
    name: 'Alice',
    email: 'alice@edgedb.io',
    posts: [
      {
        title: 'Join the EdgeDB Slack',
        content: 'https://slack.edgedb.io',
        published: true,
      },
    ],
  },
  {
    name: 'Nilu',
    email: 'nilu@edgedb.io',
    posts: [
      {
        title: 'Follow EdgeDB on Twitter',
        content: 'https://www.twitter.com/edgedatabase',
        published: true,
      },
    ],
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@edgedb.io',
    posts: [
      {
        title: 'Ask a question about EdgeDB on GitHub',
        content: 'https://www.github.com/edgedb/edgedb/discussions',
        published: true,
      },
      {
        title: 'EdgeDB on YouTube',
        content: 'https://pris.ly/youtube',
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
