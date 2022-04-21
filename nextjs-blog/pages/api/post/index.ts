import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../..';
import e from '../../../dbschema/edgeql-js';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const query = e.insert(e.BlogPost, {
      publishedAt: null,
    });
    const result = await query.run(client);
    console.log(`created ${result.id}`);
    res.json({id: result.id});
  } else {
    console.log(`Invalid request`);
    res.status(404);
  }
}
