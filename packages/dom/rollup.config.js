const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const { terser } = require('rollup-plugin-terser');

const pkg = require('./package.json');

module.exports = {
  input: 'lib/index.ts', // Set the entry to the main TypeScript file
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }), // Integrate TypeScript plugin
    terser(),
  ],
  external: ['react', 'react-dom'], // Exclude peer dependencies
};