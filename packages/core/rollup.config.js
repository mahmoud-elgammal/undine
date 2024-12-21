const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const { terser } = require('rollup-plugin-terser');
const {dts} = require('rollup-plugin-dts');

const pkg = require('./package.json');

module.exports = [
  {
    input: 'lib/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json',  }), // Integrate TypeScript plugin
      resolve(),
      commonjs(),
      terser(),],
  },
  {
    input: 'lib/types/index.d.ts',
    output: { file: 'dist/types/index.d.ts', format: 'es' },
    plugins: [dts()],
  },
];