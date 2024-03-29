<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Debug, World } from '@threlte/rapier';
	import Scene from './scene.svelte';
	import Head from '$lib/components/Head.svelte';
</script>

<Head title="3D Snake" description="Snake in 3D" />

<div class="container pt-6 mb-4 flex flex-col gap-y-4">
	<h1 class="text-2xl font-semibold">3D Snake</h1>
	<div class="text-sm">
		<p class="mb-2">Control the direction of the Snake with</p>
		<div class="flex flex-row flex-nowrap gap-2">
			{#each ['W', 'A', 'S', 'D'] as k}
				<blockquote
					class="rounded-sm bg-slate-300 w-6 h-6 flex items-center justify-center text-black font-bold"
				>
					{k}
				</blockquote>
			{/each}
		</div>
	</div>
	<div class="text-sm">
		<p class="mb-2">Rotate the cube with</p>
		<div class="flex flex-row flex-nowrap gap-2">
			{#each ['←', '→', '↑', '↓'] as k}
				<blockquote
					class="rounded-sm bg-slate-300 w-6 h-6 flex items-center justify-center text-black font-bold"
				>
					{k}
				</blockquote>
			{/each}
		</div>
	</div>
</div>
<div class="w-screen aspect-video">
	<Canvas>
		<World>
			<Debug />
			<Scene />
		</World>
	</Canvas>
</div>
