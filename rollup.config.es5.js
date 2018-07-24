import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    format: 'umd',
    file: 'dist/structured-log.bundle.js'
  },
  plugins: [typescript({
    target: 'es5',
    typescript: require('typescript')
  })],
  name: 'structuredLog',
  sourcemap: true
}
