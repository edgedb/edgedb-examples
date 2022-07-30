<script>
	import { onMount } from 'svelte'

	export let params
	let workout = {}

	onMount(async () => {
		workout = await fetch('/api/workout/' + params.id)
			.then(r => r.json())
			.then(j => j.data)
	})
</script>


<h1>Workout</h1>

<p>
	started at {workout.started_at}
</p>
