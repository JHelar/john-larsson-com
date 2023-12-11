<script lang="ts">
	import {
		BONZAI_MODE_STORE,
		BRANCH_COUNT_STORE,
		MAX_BRANCH_DEPTH_STORE,
		ROOT_LENGTH_RATIO_STORE,
		ROOT_THICKNESS_STORE,
		initialize
	} from './fractalTree';
	import Head from '$lib/components/Head.svelte';
</script>

<Head title="Fractal tree" description="An interactive simulation of a fractral tree" />

<div class="container mb-4 flex flex-col">
	<div class="mb-4">
		<h1 class="text-2xl font-semibold mb-2">Fractal tree</h1>
	</div>
	<div class="mb-2 flex row gap-x-4 items-end">
		<div class="flex-1">
			<label
				for="default-range"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Branch depth ({$MAX_BRANCH_DEPTH_STORE})</label
			>
			<input
				id="default-range"
				type="range"
				min="1"
				max="15"
				bind:value={$MAX_BRANCH_DEPTH_STORE}
				class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
			/>
		</div>
		<div class="flex-1">
			<label
				for="default-range"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Branching factor ({$BRANCH_COUNT_STORE})</label
			>
			<input
				id="default-range"
				type="range"
				min="0"
				max="10"
				bind:value={$BRANCH_COUNT_STORE}
				class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
			/>
		</div>
		<div class="flex items-center gap-x-2">
			<input
				id="default-checkbox"
				type="checkbox"
				bind:checked={$BONZAI_MODE_STORE}
				class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
			/>
			<label
				for="default-checkbox"
				class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bonzai mode</label
			>
		</div>
	</div>
</div>
<div class="w-screen m-auto">
	<canvas class="w-full" use:initialize />
</div>
