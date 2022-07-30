import Index from './pages/Index.svelte'
import Workout from './pages/Workout.svelte'

export default [
	{
		path: '/',
		component: Index,
	},
	{
		path: '/workout/:id',
		component: Workout,
	},
]
