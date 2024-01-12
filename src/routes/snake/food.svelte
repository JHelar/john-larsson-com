<script lang="ts">
	import { T } from '@threlte/core';
	import { FOOD_SIZE, foodPosition } from './foodStore';
</script>

<T.Mesh position.x={$foodPosition.x} position.y={$foodPosition.y} position.z={$foodPosition.z}>
	<T.BoxGeometry args={[FOOD_SIZE, FOOD_SIZE, FOOD_SIZE]} />
	<T.MeshBasicMaterial color="red" />
</T.Mesh>
