import {createClient} from 'edgedb';
import e from './dbschema/edgeql-js';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

export const client = createClient();
export {e};
