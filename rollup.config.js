const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const { dts } = require('rollup-plugin-dts');
const packageJson = require('./package.json');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const nodeResolve = require('@rollup/plugin-node-resolve');

const external = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
  'fs',
  'path',
];

const commonPlugins = [
  resolve({
    preferBuiltins: true,
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  }),
  commonjs({
    exclude: 'node_modules',
  }),
  json({
    preferConst: true,
  }),
  terser({
    format: {
      comments: false,
    },
    compress: {
      passes: 3,
      unsafe: true,
      drop_console: false,
      drop_debugger: true,
    },
  }),
];

module.exports = [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    external,
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false,
      }),
      nodePolyfills(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        outDir: 'dist/esm',
        sourceMap: true,
        declarationDir: './dist/esm',
        rootDir: './src',
        exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
      }),
      ...commonPlugins,
    ],
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',

      sourcemap: true,
    },
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        outDir: 'dist/cjs',
        declarationMap: false,
        sourceMap: true,
        exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
      }),
      ...commonPlugins,
    ],
  },
  // Types bundle
  {
    input: 'dist/esm/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
];
