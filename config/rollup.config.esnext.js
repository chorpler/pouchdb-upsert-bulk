import external from 'builtin-modules';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';

const pkg = require('../package.json');

export default {
  input: './src/index.ts',
  output: {
    file: pkg.esnext,
    format: 'es',
  },
  external,
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true,
    }),
    babel(),
  ],
};
