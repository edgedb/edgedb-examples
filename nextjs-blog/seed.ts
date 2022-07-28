import {createClient} from 'edgedb';

const client = createClient();

async function run() {
  await client.execute(`
    insert BlogPost {
      title := "This one weird trick makes using databases fun",
      content := "Use EdgeDB"
    };`);

  await client.execute(`
    insert BlogPost {
      title := "How to build a blog with EdgeDB and Next.js",
      content := "Let's start by scaffolding our app..."
    };`);

  console.log('Seeding complete.');
}

run();
