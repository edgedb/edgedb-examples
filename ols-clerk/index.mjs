import { createClient } from "edgedb";
const client = createClient();

async function run() {
  const result = await client
    .withGlobals({
      current_user: "user_2CEIGykjL1BLw2JAfqANe33CQnZ",
    })
    .query(`select User { id, clerk_id, posts := .<author[is BlogPost] {title} };`);
  console.log(result);
}

run();
