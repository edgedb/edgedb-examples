import type {NextApiRequest, NextApiResponse} from 'next';
import {client, e} from '../../client';

// GET /api/filterPosts?searchString=:searchString
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {searchString} = req.query as {searchString: string};
  const resultPosts = e
    .select(e.Post, (post) => ({
      id: true,
      content: true,
      published: true,
      title: true,
      createdAt: true,
      viewCount: true,
      filter: e.contains(
        e.op(post.title, '++', post.content),
        e.str(searchString)
      ),
    }))
    .run(client);

  res.json(resultPosts);
}
