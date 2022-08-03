import config from './rollup.config.js'

const pkg = require('../package.json')

// export default config => {
//   return Object.assign({}, config, {
//     dest: pkg.module,
//     format: 'es',
//   });
// };
export default Object.assign({}, config, {
  dest: pkg.module,
  format: 'es',
});
// Object.assign({}, config, {
//   dest: pkg.module,
//   format: 'es'
// })
