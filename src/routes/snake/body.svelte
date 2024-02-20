<script lang="ts">
	import { T } from '@threlte/core';
	import { bodyPartsStore } from './bodyStore';
</script>

{#each $bodyPartsStore as part}
	<T is={part} />
{/each}
