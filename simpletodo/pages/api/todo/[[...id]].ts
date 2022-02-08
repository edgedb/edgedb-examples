import {createClient} from 'edgedb';
import {NextApiRequest, NextApiResponse} from 'next';

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

    return res.status(200).json([
      {id: 'aaa', text: 'Introduce Keynote', completed: false},
      {id: 'bbb', text: 'Do live demo', completed: false},
      {id: 'ccc', text: 'Do ORMs talk', completed: false},
    ]);
  }

  // POST /api/todo
  // req.body { text: string }
  if (!id && req.method === 'POST') {
    //  insert Task {
    //    text := <str>$text
    //  };
    return res.status(500).send('Not implemented!');
  }

  // PATCH /api/todo/:id
  // req.query { id: string }
  if (req.method === 'PATCH' && !!id) {
    //  update Task
    //  filter .id = req.query.id
    //  set { completed := not .completed };
    return res.status(500).send('Not implemented!');
  }

  return res.status(400).send('Invalid request');
};

export default handler;
