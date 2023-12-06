<script lang="ts">
	import { initialize, runStore } from './gameOfLife';

	function toggleRun() {
		let run = $runStore;
		runStore.set(!run);
	}
</script>

<div class="container mb-4 flex row items-center">
	<div>
		<h1 class="text-2xl font-semibold mb-2">Conway's Game of Life</h1>
		<p class="text-sm">
			Click the grid cells to activate or deactivate them, then click "Start" to start the
			simulation.
		</p>
	</div>
	<button class="px-4 py-2 bg-red-500 hover:bg-red-600 font-semibold" on:click={toggleRun}
		>{$runStore ? 'Stop' : 'Start'}</button
	>
</div>
<div class="w-[800px] m-auto">
	<canvas class="w-full" use:initialize />
</div>
