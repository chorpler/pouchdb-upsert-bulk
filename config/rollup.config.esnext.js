import external from 'builtin-modules';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('../package.json');

export default {
  entry: 'src/index.ts',
  dest: pkg.esnext,
  format: 'es',
  external,
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true,
    }),
  ],
};
