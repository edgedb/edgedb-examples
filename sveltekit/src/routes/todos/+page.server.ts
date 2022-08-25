import { redirect as kitRedirect } from '@sveltejs/kit';
import type { PageServerLoad, Action } from './$types';
import { getFormData } from 'remix-params-helper';
import { z } from 'zod';
import e from '$db';
import { client } from '$lib/edgedb';

export const load: PageServerLoad = async ({ locals }) => {
	// locals.userid comes from src/hooks.ts
	const todos = await e
		.select(e.Todo, (todo) => ({
			id: true,
			text: true,
			done: true,
			filter: e.op(todo.created_by, '=', e.uuid(locals.userid))
		}))
		.run(client);

	return { todos };
};

export const POST: Action = async ({ request, locals }) => {
	const schema = z.object({
		text: z.string()
	});
	const { data, errors, success } = await getFormData(request, schema);

	if (!success) {
		return { errors };
	}

	await e
		.insert(e.Todo, {
			text: data.text,
			created_by: locals.userid
		})
		.run(client);
};

// If the user has JavaScript disabled, the URL will change to
// include the method override unless we redirect back to /todos
const redirect = kitRedirect(303, '/todos');

export const PATCH: Action = async ({ request }) => {
	const schema = z.object({
		id: z.string().uuid(),
		text: z.string().optional(),
		done: z.boolean().optional()
	});
	const { data, errors, success } = await getFormData(request, schema);

	if (!success) {
		return { errors };
	}

	const { id, text, done } = data;
	await e
		.update(e.Todo, (todo) => ({
			filter: e.op(todo.id, '=', e.uuid(id)),
			set: { text, done }
		}))
		.run(client);

	throw redirect;
};

export const DELETE: Action = async ({ request }) => {
	const schema = z.object({
		id: z.string().uuid()
	});
	const { data, errors, success } = await getFormData(request, schema);

	if (!success) {
		return { errors };
	}

	await e
		.delete(e.Todo, (todo) => ({
			filter: e.op(todo.id, '=', e.uuid(data.id))
		}))
		.run(client);

	throw redirect;
};
