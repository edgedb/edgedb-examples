<script>
	import { onMount } from 'svelte'

	let exercises = []
	let form = { name: '' }
	let selected = { name: '', id: '' }

	onMount(async () => {
		exercises = await fetch('/api/exercise')
			.then(r => r.json())
			.then(j => j.data)
	})

	const createExercise = async () => {
		exercises = await fetch('/api/exercise', {
			method: 'POST',
			body: JSON.stringify(form),
		})
			.then(r => r.json())
			.then(j => j.data)

		form = { name: '' }
	}

	const updateExercise = async () => {
		exercises = await fetch('/api/exercise/', {
			method: 'PUT',
			body: JSON.stringify(selected),
		})
			.then(r => r.json())
			.then(j => j.data)

		selected = { name: '', id: '' }
	}

	const setSelected = (id) => () => {
		selected = {
			id: id,
			name: exercises.find(e => e.id === id).name,
		}
	}
</script>


<h1>Exercises</h1>

<input bind:value={form.name}>
<button on:click={createExercise}>+</button>

{#each exercises as exercise}
	{#if exercise.id === selected.id}
	<p>
		<input bind:value={selected.name}>
		<button on:click={updateExercise}>Save</button>
	</p>
	{:else}
	<p on:click={setSelected(exercise.id)} class="clickable">
		{exercise.name}
	</p>
	{/if}
{/each}


<style>
	.clickable {
		cursor: pointer;
	}
</style>
