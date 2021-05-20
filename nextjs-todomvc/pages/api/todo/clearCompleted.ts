import { NextApiRequest, NextApiResponse } from 'next';

import { usePool } from '../../../utils/usePool';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const pool = await usePool();

  // POST /api/todo/clearCompleted
  if (req.method === 'POST') {
    await pool.queryJSON(`delete Task filter .completed = true;`);
    return res.status(200).send('Success');
  }

  return res.status(400);
};

export default handler;
