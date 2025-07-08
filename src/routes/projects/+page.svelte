<script>
	import Head from '$lib/components/Head.svelte';

	const projects = [
		{
			name: 'Fractal tree',
			description:
				'Implementation of an animated fractal tree with controls to customize the appearance.',
			url: '/fractalTree'
		},
		{
			name: '3D Snake',
			description: 'Implementation of snake in 3D using three.js with webgl.',
			url: '/snake'
		},
		{
			name: "Conway's Game of Life",
			description:
				"Implementation of Conway's Game of Life, with customizable parameters and grid cell editor.",
			url: '/gameOfLife'
		},
		{
			name: 'Connect 4',
			description: 'Connect 4 using three js (WiP).',
			url: '/connect4'
		},
		{
			name: 'Minesweeper',
			description: 'Minesweeper using three js (WiP).',
			url: '/minesweeper'
		}
	];
</script>

<Head title="Hobby projects" description="Hobby projects" />

<div class="container pt-6">
	<h1 class="text-2xl font-semibold">Hobby projects</h1>
	<p class="text-xl mt-2">Graphical web projects in various states of completion</p>
	<div class="flex flex-row flex-wrap gap-4 mt-4">
		{#each projects as project}
			<a
				href={project.url}
				class="block max-w-sm flex-1 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
			>
				<h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{project.name}
				</h2>
				<p class="font-normal text-gray-700 dark:text-gray-400">{project.description}</p>
			</a>
		{/each}
	</div>
</div>
