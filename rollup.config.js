import typescript from 'rollup-plugin-typescript2'
import transformPaths from '@zerollup/ts-transform-paths'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

const devDeps = Object.keys(pkg.devDependencies || {})
const deps = Object.keys(pkg.dependencies || {}).concat(devDeps)

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    external: (name, fpath) => /node_modules/.test(fpath) || deps.includes(name),
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        objectHashIgnoreUnknownHack: true,
        transformers: [service => transformPaths(service.getProgram())]
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true
      }),
      nodeResolve(),
      // commonjs({
      //   include: /node_modules/
      // }),
    ]
  }
]
