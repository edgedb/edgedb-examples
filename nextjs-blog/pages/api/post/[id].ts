import type {NextApiRequest, NextApiResponse} from 'next';
import {client} from '../..';
import e from '../../../dbschema/edgeql-js';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id as string;
  console.log(`${req.method} /api/post`);

  if (req.method === 'POST') {
    const payload = req.body;
    console.log(payload);
    /**
     * update BlogPost by Id
     * set title, content, published
     */

    const query = e.update(e.BlogPost, (post) => ({
      filter: e.op(post.id, '=', e.uuid(postId)),
      set: {
        title: payload.title,
        content: payload.content,
        publishedAt: e.datetime_current(),
      },
    }));

    const fetchQuery = e.select(query, (q) => ({
      id: true,
      content: true,
      title: true,
      publishedAtStr: e.cast(e.str, q.publishedAt),
    }));

    const result = await fetchQuery.run(client);
    console.log(result);
    res.json(result);
  } else {
    console.log(`Invalid request`);
    res.status(404);
  }
}
