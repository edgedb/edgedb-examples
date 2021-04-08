import * as z from 'zod';
import { usePool } from '../../../utils/usePool';
import { createRouter } from './[trpc]';
import { Task } from '../../../pages/[filter]';

export const todoRouter = createRouter()
  .query('all', {
    async resolve() {
      const pool = await usePool();
      const result = await pool.queryJSON(
        'SELECT Task { id, text, completed } ORDER BY .id;'
      );
      const data = JSON.parse(result) as Task[];

      return data;
    },
  })
  .mutation('add', {
    input: z.object({
      text: z.string().min(1),
    }),
    async resolve({ input }) {
      const pool = await usePool();
      await pool.queryJSON('INSERT Task { text := <str>$text };', {
        text: input.text,
      });
      return true;
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        completed: z.boolean(),
        text: z.string().min(1),
      }),
    }),
    async resolve({ input }) {
      const pool = await usePool();

      await pool.queryJSON(
        `UPDATE Task FILTER .id = <uuid>$id SET { text := <str>$text, completed := <bool>$completed };`,
        {
          id: input.id,
          text: input.data.text,
          completed: input.data.completed,
        }
      );
      return true;
    },
  })
  .mutation('delete', {
    input: z.string().uuid(),
    async resolve({ input }) {
      const pool = await usePool();

      await pool.queryJSON(`DELETE Task FILTER .id = <uuid>$id;`, {
        id: input,
      });

      return input;
    },
  })
  .mutation('clearCompleted', {
    async resolve() {
      const pool = await usePool();
      await pool.queryJSON(`delete Task filter .completed = true;`);
      return true;
    },
  });
