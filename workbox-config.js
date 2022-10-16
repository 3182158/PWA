module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,png,svg,html,json}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};