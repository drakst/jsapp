import resolve  from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sass     from 'rollup-plugin-sass';
// import babel from 'rollup-plugin-babel';

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/app.js',
		format: 'iife',
		name: 'app',
	},
	// sourceMap: 'inline',
	plugins: [
		resolve(),
		commonjs(),
		sass({ // настроить правильно
			insert: true
		})
		// babel({
		// 	exclude: 'node_modules/**' // only transpile our source code
		// })
	]
};