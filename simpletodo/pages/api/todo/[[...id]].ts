import {createClient} from 'edgedb';
import {NextApiRequest, NextApiResponse} from 'next';

import e from '../../../dbschema/edgeql-js';

const client = createClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Three endpoints:
  //   GET /api/todo
  //   POST /api/todo
  //   PATCH /api/todo/:id

  console.log(`${req.method} ${req.url}`);

  // get id
  const id: string | undefined = req.query.id?.[0];

  // GET /api/todo
  if (!id && req.method === 'GET') {
    //  select Task {
    //    id,
    //    text,
    //    completed
    //  };
    const query = e.select(e.Todo, (todo) => ({
      id: true,
      text: true,
      completed: true,
      order_by: todo.id,
    }));

    const result = await query.run(client);

    return res.status(200).json(result);
  }

  // POST /api/todo
  // req.body { text: string }
  if (!id && req.method === 'POST') {
    //  insert Task {
    //    text := <str>$text
    //  };
    await e
      .insert(e.Todo, {
        text: req.body.text,
      })
      .run(client);
    return res.status(200).send('Success');
  }

  // PATCH /api/todo/:id
  // req.query { id: string }
  if (req.method === 'PATCH' && !!id) {
    //  update Task
    //  filter .id = req.query.id
    //  set { completed := not .completed };

    await e
      .update(e.Todo, (todo) => ({
        filter: e.op(todo.id, '=', e.uuid(id)),
        set: {
          completed: e.op('not', todo.completed),
        },
      }))
      .run(client);

    return res.status(200).send('Success');
  }

  return res.status(400).send('Invalid request.');
};

export default handler;
