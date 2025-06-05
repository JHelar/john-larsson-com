<script>
	import Head from '$lib/components/Head.svelte';
</script>

<Head />

<div class="container pt-6">
	<h1 class="text-2xl font-semibold">Hello, I'm John!</h1>
	<p class="mt-6">
		I am a senior fullstack developer (with a focus on the frontend) from Sweden, where I am
		currently working on a Swedish white label SaaS product for the energy and smart home sector in
		the Nordics.
		<br />
		Current focus is to to transform the React Native based white label application to be accessible
		and compliant with the WCAG AA criteria.
	</p>
	<p class="mt-6">
		I enjoy everything from playing piano, running marathons and starting new code projects that has
		a lifespan of maximum one month (the common curse of a developer it seems!).
	</p>
	<p>
		These projects can span anywhere from <a href="https://github.com/JHelar/yaff"
			>creating a HTML template engine</a
		>
		in Rust (or why not in <a href="https://github.com/JHelar/dumbo">golang?</a>), to my latest deep
		dive into AI driven translations directly generated from
		<a href="https://github.com/JHelar/translang">Figma design links</a>.
	</p>
	<ul class="mt-6">
		<li><a href="https://www.linkedin.com/in/john-larsson-8ba758b3/">LinkedIn</a></li>
		<li><a href="https://github.com/JHelar">GitHub</a></li>
	</ul>
</div>
<div class="container mt-6">
	<h2 class="text-2xl font-semibold">Work</h2>
	<h3 class="mt-6">Some of my past work experiences.</h3>
	<ol class="list-decimal ml-8 mt-6">
		<li>
			Senior fullstack developer, consultant at <a href="skry.se">Skry</a>
		</li>
		<li>
			Design system engineer at <a href="https://telia.se">Telia</a>, created a design system to be
			used along side their Figma instance to automatically synchronize and manage design tokens and
			components to a multi platform environment.
		</li>
		<li>
			Fullstack developer at <a href="https://telia.se">Telia</a>, worked for their streaming
			platform and white label product <a href="https://teliaplay.se">teliaplay.se</a>.
		</li>
		<li>
			Fullstack developer for <a href="https://klarna.se">Klarna</a> a Swedish based PNBL fintech company.
			I helped them implement a verity of features for their marketing domain.
		</li>
		<li>
			Frontend develop, consultant at <a href="https://hiq.se">HiQ</a>. Worked with a multitude of
			Swedish municipals and private companies to create accessible websites and applications.
		</li>
	</ol>
</div>
<div class="container mt-6">
	<h2 class="text-2xl font-semibold">Hobby projects</h2>
	<p class="mt-6">
		This list contains some of the latest projects that I have been working on outside my
		professional work.
	</p>
	<ol class="list-decimal ml-8 mt-6">
		<li>
			<a href="https://github.com/JHelar/translang">Translang</a>
			<small>[A work in progress]</small> a translation webb platform service that extracts strings from
			a given Figma design, uses OpenAI to generate the translations and copy keys for the strings within
			the design.
		</li>
		<li>
			<a href="https://github.com/JHelar/dumbo">Dumbo</a> <small>[A work in progress]</small> a dive
			into a templating engine for golang backends to render html with components in focus.
		</li>
		<li>
			<strong>Dumbbell</strong> a fitness web app written with
			<a href="https://go.dev/">go, and go templates</a>,
			<a href="http://tailwindcss.com">Tailwind</a>
			and <a href="https://htmx.org/">HTMX</a>. Using
			<a href="https://www.terraform.io/">Terraform</a> to manage and deploy the application to AWS EC2.
		</li>
		<li>
			<a href="/snake">3D Snake</a> written using
			<a href="https://threejs.org/">three.js</a>
			with the svelte wrapper
			<a href="https://threlte.xyz/">threlte</a>
			<small>[A work in progress]</small>.
		</li>
	</ol>
	<p class="mt-6">
		Also cannot forget the recurring christmas project <a
			href="https://github.com/JHelar/advent-of-code">Advent of Code</a
		>!<br />
		Check out other projects on my <a href="https://github.com/JHelar">GitHub</a> or other web
		<a href="/projects">hobby projects</a>.
	</p>
</div>
