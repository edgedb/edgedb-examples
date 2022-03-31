import type {NextApiRequest, NextApiResponse} from 'next';
import {client, e} from '../../../client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id as string;

  if (req.method === 'GET') {
    handleGET(postId, res);
  } else if (req.method === 'DELETE') {
    handleDELETE(postId, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/post/:id
async function handleGET(postId: string, res: NextApiResponse) {
  const post = await e
    .select(e.Post, (post) => ({
      filter: e.op(post.id, '=', e.uuid(postId)),
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
      viewCount: true,
      author: {name: true, id: true},
    }))
    .run(client);

  res.json(post);
}

// DELETE /api/post/:id
async function handleDELETE(postId: string, res: NextApiResponse) {
  const post = await e
    .delete(e.Post, (post) => ({
      filter: e.op(post.id, '=', e.uuid(postId)),
    }))
    .run(client);
  // const post = await prisma.post.delete({
  //   where: {id: Number(postId)},
  // });
  res.json(post);
}
