import Index from './pages/Index.svelte'
import Workout from './pages/Workout.svelte'
import Exercise from './pages/Exercise.svelte'

export default [
	{
		path: '/',
		component: Index,
	},
	{
		path: '/workout/:id',
		component: Workout,
	},
	{
		path: '/exercises',
		component: Exercise,
	}
]
