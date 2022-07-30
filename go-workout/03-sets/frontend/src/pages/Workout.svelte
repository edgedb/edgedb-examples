<script>
	import { onMount } from 'svelte'

	export let params
	let workout = { id: '', sets: [] }
	let exercises = []
	let form = {
		workout: { id: '' },
		exercise: { id: '' },
		weight: '',
		reps: '',
	}

	onMount(async () => {
		workout = await fetch('/api/workout/' + params.id)
			.then(r => r.json())
			.then(j => j.data)

		form = { ...form, workout: { id: workout.id } }

		exercises = await fetch('/api/exercise')
			.then(r => r.json())
			.then(j => j.data)
	})

	const createSet = async () => {
		workout = await fetch('/api/set', {
			method: 'POST',
			body: JSON.stringify(form),
		})
			.then(r => r.json())
			.then(j => j.data)
	}
</script>


<h1>Workout</h1>

<p>
	started at {workout.started_at}
</p>

<form on:submit|preventDefault={createSet}>
	<select bind:value={form.exercise.id} required>
		<option value=""></option>
		{#each exercises as exercise}
		<option value="{exercise.id}">
			{exercise.name}
		</option>
		{/each}
	</select>
	<input type="number" bind:value={form.reps} placeholder="reps" min="1" required>
	<input type="number" bind:value={form.weight} placeholder="lbs" step="0.5" required>
	<input type="submit" value="+">
</form>

{#each workout.sets as set}
<p>
	{set.exercise.name} - {set.reps} x {set.weight}lbs
</p>
{/each}
