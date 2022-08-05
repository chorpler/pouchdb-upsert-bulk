import config from './rollup.config';
const pkg = require('../package.json')

export default Object.assign({}, config, {
  output: {
    file: pkg.browser,
    format: 'es',
  },
});
