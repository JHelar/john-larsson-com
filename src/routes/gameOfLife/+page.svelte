<script lang="ts">
	import {
		initialize,
		runStore,
		clear,
		speedStore,
		cellSizeStore,
		deathAnimationStore,
		rulesStore
	} from './gameOfLife';
	import Head from '$lib/components/Head.svelte';

	function toggleRun() {
		let run = $runStore;
		runStore.set(!run);
	}

	function updateSpeed(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		speedStore.set(Number(e.currentTarget.value));
	}

	function updateCellSize(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		cellSizeStore.set(Number(e.currentTarget.value));
	}
</script>

<Head
	title="Conway's Game of Life"
	description="An interactive simulation of Conway's Game of Life"
/>

<div class="container pt-6 mb-4 flex flex-col">
	<div class="mb-4">
		<h1 class="text-2xl font-semibold mb-2">Conway's Game of Life</h1>
		<p class="text-sm">
			Click the grid cells to activate or deactivate them, then click "Start" to start the
			simulation.
		</p>
	</div>
	<div class="mb-2 flex row gap-x-4 items-end">
		<div class="flex-1">
			<label
				for="default-range"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Simulation speed ({$speedStore})</label
			>
			<input
				id="default-range"
				type="range"
				min="0"
				max="100"
				value={$speedStore}
				on:input={updateSpeed}
				class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
			/>
		</div>
		<div class="flex-1">
			<label
				for="default-range"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Cell size ({$cellSizeStore})</label
			>
			<input
				id="default-range"
				type="range"
				min="10"
				max="50"
				value={$cellSizeStore}
				on:input={updateCellSize}
				class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
			/>
		</div>
		<div class="flex items-center gap-x-2">
			<input
				id="default-checkbox"
				type="checkbox"
				bind:checked={$deathAnimationStore}
				class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
			/>
			<label
				for="default-checkbox"
				class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Death animation</label
			>
		</div>
	</div>
	<div class="mb-2">
		<label for="rules" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>Rules</label
		>
		<input
			type="text"
			id="rules"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder="BXSXDX"
			pattern="B[0-9]+S[0-9]+(D[0-9]+)?"
			bind:value={$rulesStore}
		/>
	</div>
	<div class="flex row items-center gap-x-2">
		<button class="px-4 py-2 bg-red-500 font-semibold" on:click={toggleRun}
			>{$runStore ? 'Stop' : 'Start'}</button
		>
		<button class="px-4 py-2 text-red-500 font-semibold" on:click={clear}>Clear</button>
	</div>
</div>
<div class="w-screen m-auto">
	<canvas class="w-full" use:initialize />
</div>
