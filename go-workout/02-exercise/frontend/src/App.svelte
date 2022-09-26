<script>
  import router from "page"
  import routes from './routes'

	let params;
	let page;

  routes.forEach(route => {
    router(
      route.path,
      (ctx) => {
        params = ctx.params
				page = route.component
      }
    )
  })

	router.start()
</script>


<main>
	<a href="/">Workouts</a> |
	<a href="/exercises">Exercises</a>

	<svelte:component this={page} params={params} />
</main>

