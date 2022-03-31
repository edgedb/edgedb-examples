import type {NextApiRequest, NextApiResponse} from 'next';
import {client, e} from '../../../client';

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {title, content, authorEmail} = req.body;

  const newPost = await e.insert(e.Post, {
    title,
    content,
    author: e.select(e.User, (user) => ({
      filter: e.op(user.email, '=', authorEmail as string),
    })),
  });

  const result = e
    .select(newPost, () => ({
      title: true,
      content: true,
      author: {id: true, name: true, email: true},
    }))
    .run(client);
  res.json(result);
}
