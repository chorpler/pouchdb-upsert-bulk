import buble from 'rollup-plugin-buble'
import typescript from 'rollup-plugin-typescript2'
import config from './rollup.config.esnext.js'

const pkg = require('../package.json')

// export default config => {
//   return Object.assign({}, config, {
//     input: 'src/index.ts',
//     dest: pkg.main,
//     format: 'cjs',
//     plugins: config.plugins.concat([
//       typescript({
//         rollupCommonJSResolveHack: true,
//       }),
//       buble(),
//     ]),
//   });
// };
export default Object.assign({}, config, {

  output: {
    file: pkg.main,
    format: 'es',
  },
  plugins: config.plugins.concat([
    typescript({
      rollupCommonJSResolveHack: true,
    }),
    // buble(),
  ]),
});
