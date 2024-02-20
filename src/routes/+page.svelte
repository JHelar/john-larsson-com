<script>
	import Head from '$lib/components/Head.svelte';
</script>

<Head />

<div class="container pt-6">
	<h1 class="text-2xl font-semibold">Hello, I'm John!</h1>
	<p class="mt-6">
		I'm a fullstack developer from Sweden, where I am currently working at Telia, specificly with
		their VOD/SVOD content aggregator product <a href="https://teliaplay.se">Teliaplay</a> and
		<a href="https://cmore.se">C More</a>.
	</p>
	<p class="mt-6">
		Today, I'm currently working as a senior web and systems developer. Before that I worked as a
		fullstack engineer within the marketing domain at a finctech company. <br />
		And before that I was part of a small consultant team that focused on creating websites and tools
		for some of Swedens municipals.
	</p>
	<p class="mt-6">
		I enjoy everything from playing piano, running marathons and starting new code projects that has
		a lifespan of maximum one month (the common curse of a developer it seems!). These projects can
		span anywere from <a href="https://github.com/JHelar/yaff">creating a HTML templating engine</a>
		in Rust, a <a href="https://github.com/JHelar/om">functional object mapper Library</a> in
		Typescript to a nose dive into
		<a href="https://github.com/JHelar/NotesApp">Kotlin multiplatform</a>.<br />
		Or check out my latest dive into
		<a href="/gameOfLife">Conway's Game of Life</a>!
	</p>
	<ul class="mt-6">
		<li><a href="https://www.linkedin.com/in/john-larsson-8ba758b3/">LinkedIn</a></li>
		<li><a href="https://github.com/JHelar">GitHub</a></li>
	</ul>
</div>
<div class="container mt-6">
	<h2 class="text-2xl font-semibold">Work</h2>
	<p class="mt-6">This list contains some of the work that I have done.</p>
	<ol class="list-decimal list-inside ml-8 mt-6">
		<li>
			One Design System Library, Telia <small>[article coming soon™, ask me about it!]</small>
		</li>
		<li>In app messages, Klarna <small>[article coming soon™, ask me about it!]</small></li>
		<li>Block articles, Klarna <small>[article coming soon™, ask me about it!]</small></li>
		<li>
			SiteVision project template engine (svhiq), HiQ <small
				>[article coming soon™, ask me about it!]</small
			>
		</li>
	</ol>
</div>
<div class="container mt-6">
	<h2 class="text-2xl font-semibold">Hobby projects</h2>
	<p class="mt-6">
		This list contains some of the latest projects that I have been working on outside my
		professional work.
	</p>
	<ol class="list-decimal list-inside ml-8 mt-6">
		<li>
			<a href="https://github.com/JHelar/dumbo">Dumbo</a> <small>[A work in progress]</small> a dive
			into a templating engine for golang backends to render html with components in focus.
		</li>
		<li>
			<a href="http://ec2-99-81-179-160.eu-west-1.compute.amazonaws.com">Dumbbell</a> a fitness web
			app written with <a href="https://go.dev/">go, and go templates</a>,
			<a href="http://tailwindcss.com">Tailwind</a>
			and <a href="https://htmx.org/">HTMX</a>.<br />
			Hosted on AWS EC2 using <a href="https://www.terraform.io/">Terraform</a> for deployment.
		</li>
		<li>
			3D Snake written using
			<a href="https://threejs.org/">three.js</a>
			with the svelte wrapper
			<a href="https://threlte.xyz/">threlte</a>.<br /> <a href="/snake">Click here to play</a>
			<small>[A work in progress, not finished]</small>.
		</li>
	</ol>
	<p class="mt-6">
		Check out the source code and other project on my <a href="https://github.com/JHelar">GitHub</a
		>.
	</p>
</div>
