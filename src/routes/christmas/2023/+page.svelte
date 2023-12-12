<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import controllerImage from './controller.jpg';
	import wokpan from './wokpan.jpeg';
	import mockapot from './mockapot.jpg';
	import bewerage from './bewerage.jpeg';
	import gow from './gow.jpeg';
	import scale from './scale.jpg';
	import candle from './candle.webp';
	import lego from './lego.webp';
	import op from './op.jpeg';
	import { initialize } from './snowfall';
</script>

<Head title="Tomtelista 2023" />

<canvas class="fixed inset-0 h-screen w-screen -z-10" use:initialize />
<div
	class="max-w-screen-lg mx-auto flex flex-col gap-y-4 mt-4 p-4 rounded-md bg-slate-900 bg-blend-saturation bg-opacity-75"
>
	<h1 class="text-4xl text-center mb-8 text-yellow-400">John's Tomtelista 2023</h1>
	<ul class="flex flex-col gap-y-4 max-h-[480px] flex-wrap">
		<li class="flex items-center gap-x-4 text-xl">
			<img
				class="w-14 h-14 rounded-full object-contain"
				src={controllerImage}
				alt="Xbox kontroller"
			/>Xbox trådlös kontroller
		</li>
		<li class="flex items-center gap-x-4 text-xl">
			<img
				class="w-14 h-14 rounded-full object-contain bg-white"
				src={wokpan}
				alt="Stor wokpanna"
			/>Stor wokpanna i kolstål (inte teflon), som funkar för induktion.
		</li>
		<li class="flex items-center gap-x-4 text-xl">
			<img
				class="w-14 h-14 rounded-full object-contain bg-white"
				src={mockapot}
				alt="Mockapot"
			/>Bialetti mockapot, som funkar för induktion
		</li>
		<li class="flex items-center gap-x-4 text-xl">
			<img class="w-14 h-14 rounded-full object-contain bg-white" src={bewerage} alt="Brygd" />God
			brygd (kaffebönor, löste)
		</li>
		<li class="flex items-center gap-x-4 text-xl">
			<img class="w-14 h-14 rounded-full object-contain bg-white" src={gow} alt="God of War" />God
			of War till PC
		</li>
		<li class="flex items-center gap-x-4 text-xl">
			<img
				class="w-14 h-14 rounded-full object-contain bg-white"
				src={scale}
				alt="Köksvåg"
			/>Digital köksvåg med bra precision till 1 gram
		</li>
		<li class="flex items-center gap-x-4 text-xl">
			<img
				class="w-14 h-14 rounded-full object-contain bg-white"
				src={candle}
				alt="Doftljus"
			/>Stort doftljus
		</li>
		<li class="flex items-center gap-x-4 text-xl">
			<img class="w-14 h-14 rounded-full object-contain bg-white" src={lego} alt="Legoblommor" />Fin
			legomodell (bil, blommor etc)
		</li>
		<li class="flex items-center gap-x-4 text-xl">
			<img class="w-14 h-14 rounded-full object-contain bg-white" src={op} alt="Legoblommor" />One
			Piece Vol. 96
		</li>
	</ul>
</div>
