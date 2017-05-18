
module.exports = {
  injectChanges: true,
  files: ['./app/**/*.{html,css,js}'],
  tunnel: 'totem',
  open: 'tunnel',
  watchOptions: {
    ignored: 'node_modules'
  },
  server: {
    baseDir: './app'
  }
};
