import type {NextApiRequest, NextApiResponse} from 'next';
import {client, e} from '../../client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const posts = await prisma.post.findMany({
  //   where: {published: true},
  //   include: {author: true},
  // });
  const posts = await e
    .select(e.Post, (post) => ({
      id: true,
      content: true,
      published: true,
      title: true,
      createdAt: true,
      viewCount: true,
      author: {
        id: true,
        email: true,
        name: true,
      },
      filter: e.op(post.published, '=', true),
    }))
    .run(client);
  console.log(posts);
  res.json(posts);
}
