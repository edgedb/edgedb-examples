import type {NextApiRequest, NextApiResponse} from 'next';
import {createClient} from 'edgedb';
import e, {$infer} from '../../dbschema/edgeql-js';

export const client = createClient();

const getPosts = e.select(e.BlogPost, () => ({
  id: true,
  title: true,
  content: true,
}));

export type GetPosts = $infer<typeof getPosts>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const posts = await getPosts.run(client);
  res.status(200).json(posts);
}
