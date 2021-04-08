import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'edgedb';
import { usePool } from '../../utils/usePool';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const pool = await usePool();
  const result = await pool.query('SELECT Task { id, text, completed };');
  res.status(200).json([...result]);
};

export default handler;
