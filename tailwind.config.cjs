/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,ts,svelte}'],
	theme: {
		listStyleType: {
			decimal: 'decimal-leading-zero',
			disc: 'disc',
			square: 'square'
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '2rem'
			},
			screens: {
				DEFAULT: '680px'
			}
		},
		extend: {}
	},
	plugins: []
};
