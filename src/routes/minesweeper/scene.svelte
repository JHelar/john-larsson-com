<script lang="ts">
	import { T } from '@threlte/core';
	import Field from './field/field.svelte';
	import { interactivity } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { newGame } from './gameLogic';

	interactivity();

	onMount(() => {
		newGame();
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[0, 0, 10]}
	fov={50}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0);
	}}
/>
<T.DirectionalLight position={[0, 0, 10]} />
<Field />
