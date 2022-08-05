import config from './rollup.config';

export default Object.assign({}, config, {
  format: 'cjs',
  dest: 'pkg.browser',
});
