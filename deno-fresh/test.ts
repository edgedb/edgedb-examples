import {createClient} from 'edgedb';

import e from './dbschema/edgeql-js/index.ts';

const client = createClient();
const query = e.select({
  num: e.int64(35),
  msg: e.str('Hello world'),
});

const result = await query.run(client);
console.log(JSON.stringify(result, null, 2));

Deno.exit();
