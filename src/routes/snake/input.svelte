<script lang="ts">
	import { browser } from '$app/environment';
	import { InputKey, KeyboardMap, inputStore } from './inputMap';

	function onKeydown(event: KeyboardEvent) {
		event.stopPropagation();

		const input: InputKey | null = KeyboardMap[event.code] ?? null;
		if (input) {
			$inputStore = input;
		}
	}

	function onKeyup(event: KeyboardEvent) {
		event.stopPropagation();
		$inputStore = null;
	}

	if (browser) {
		document.documentElement.addEventListener('keydown', onKeydown);
		document.documentElement.addEventListener('keyup', onKeyup);
	}
</script>
