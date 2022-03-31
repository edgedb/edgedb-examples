import {NextApiRequest, NextApiResponse} from 'next';

import {client} from '../../../client';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id;

  // PATCH /api/todo/[id]
  // expects { text: string; completed: string; }
  if (req.method === 'PATCH') {
    await client.queryJSON(
      `UPDATE Task FILTER .id = <uuid>$id SET { text := <str>$text, completed := <bool>$completed };`,
      {
        id: id,
        text: req.body.text,
        completed: req.body.completed,
      }
    );
    return res.status(200).send('Success');
  }

  // DELETE /api/todo/[id]
  if (req.method === 'DELETE') {
    await client.queryJSON(`DELETE Task FILTER .id = <uuid>$id;`, {
      id,
    });
    return res.status(200).send('Success');
  }

  return res.status(400);
};

export default handler;
