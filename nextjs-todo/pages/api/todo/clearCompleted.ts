import {NextApiRequest, NextApiResponse} from 'next';

import {client} from '../../../client';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // POST /api/todo/clearCompleted
  if (req.method === 'POST') {
    await client.queryJSON(`delete Task filter .completed = true;`);
    return res.status(200).send('Success');
  }

  return res.status(400);
};

export default handler;
