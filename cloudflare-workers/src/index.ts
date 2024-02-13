import * as edgedb from 'edgedb';

export default {
	async fetch(_request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const client = edgedb.createHttpClient({
			tlsSecurity: 'insecure',
			dsn: env.EDGEDB_DSN,
		});
		const movies = await client.query(`
			select Movie {
				title
			}
		  `);

		return new Response(JSON.stringify(movies, null, 2), {
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		});
	},
} satisfies ExportedHandler<Env>;
