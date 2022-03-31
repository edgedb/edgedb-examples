import type {NextApiRequest, NextApiResponse} from 'next';
import {client, e} from '../../../client';

// PUT /api/publish/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id as string;
  const post = await e
    .update(e.Post, (post) => ({
      filter: e.op(post.id, '=', e.uuid(postId)),
      set: {
        published: true,
      },
    }))
    .run(client);
  res.json(post);
}
