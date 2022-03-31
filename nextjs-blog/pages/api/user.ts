import type {NextApiRequest, NextApiResponse} from 'next';
import {client, e} from '../../client';

// POST /api/user
// Required fields in body: name, email
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = e.insert(e.User, {
    name: req.body.name as string,
    email: req.body.name as string,
  });
  res.json(result);
}
