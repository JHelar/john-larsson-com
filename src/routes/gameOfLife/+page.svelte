<script lang="ts">
	import { initialize, runStore, clear, speedStore } from './gameOfLife';

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
</script>

<div class="container mb-4 flex flex-col">
	<div class="mb-4">
		<h1 class="text-2xl font-semibold mb-2">Conway's Game of Life</h1>
		<p class="text-sm">
			Click the grid cells to activate or deactivate them, then click "Start" to start the
			simulation.
		</p>
	</div>
	<div class="mb-2">
		<label for="default-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
	<div class="flex row items-center gap-x-2">
		<button class="px-4 py-2 bg-red-500 font-semibold" on:click={toggleRun}
			>{$runStore ? 'Stop' : 'Start'}</button
		>
		<button class="px-4 py-2 text-red-500 font-semibold" on:click={clear}>Clear</button>
	</div>
</div>
<div class="w-[800px] m-auto">
	<canvas class="w-full" use:initialize />
</div>
