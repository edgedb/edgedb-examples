<script>
	import { onMount } from 'svelte'

	let workouts = []

	const getWorkoutHistory = async () => {
		workouts = await fetch('/api/workout')
			.then(r => r.json())
			.then(j => j.data)
	}

	const createWorkout = async () => {
		await fetch('/api/workout', { method: 'POST' })
		await getWorkoutHistory()
	}

	onMount(getWorkoutHistory)
</script>


<h1>Workout History</h1>

<div>
	<button on:click={createWorkout}>+</button>
</div>

{#each workouts as workout}
<p>
	<a href="/workout/{workout.id}">{workout.started_at}</a>
</p>
{/each}
