<header class="container mt-6">
	<a href="/">J.H.E.L</a>
</header>

<style lang="scss">
	a {
		@apply text-2xl text-white -ml-2 pl-2 pr-2 pt-1 pb-1 inline-block relative hover:no-underline focus-visible:outline-none hover:text-red-500 focus-visible:text-red-500 transition-colors;

		&::after {
			content: '';
			@apply absolute inset-0 block box-border border-4 border-red-500 border-r-0;

			animation-name: out;
			animation-fill-mode: forwards;
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
			animation-duration: 1s;
		}

		&:focus-visible,
		&:hover {
			&::after {
				animation-name: in;
				animation-fill-mode: forwards;
				animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
				text-decoration: none;
			}
		}
	}

	@keyframes in {
		0% {
			clip-path: polygon(0 50%, 4px 50%, 4px 50%, 0 50%);
		}
		50% {
			clip-path: polygon(0 0, 4px 0, 4px 100%, 0 100%);
		}
		100% {
			clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
		}
	}

	@keyframes out {
		0% {
			clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
		}
		50% {
			clip-path: polygon(0 0, 4px 0, 4px 100%, 0 100%);
		}
		100% {
			clip-path: polygon(0 50%, 4px 50%, 4px 50%, 0 50%);
		}
	}
</style>
