import { createPool, Pool } from 'edgedb';

let pool: Pool | null = null;
export const usePool = async () => {
  if (pool) return pool;
  pool = await createPool();
  return pool;
};
