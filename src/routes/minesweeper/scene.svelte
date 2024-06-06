<script lang="ts">
	import { T } from '@threlte/core';
	import Field from './field/field.svelte';
	import { interactivity } from '@threlte/extras';

	interactivity();
</script>

<T.PerspectiveCamera
	makeDefault
	position={[0, 0, 10]}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0);
	}}
/>
<T.DirectionalLight position={[0, 0, 10]} />
<Field />
