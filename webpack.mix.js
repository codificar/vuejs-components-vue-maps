const mix = require('laravel-mix');

mix.js('./index.js', 'dist/index.js').vue();

const path = require('path');

mix.webpackConfig({
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    },
	},
	output: {
		libraryTarget: 'umd',
}
});
