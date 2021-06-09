// craco.config.js
const path = require('path')

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    alias: {
      '@': path.resolve('src'),
      src: path.resolve('src'),
      assets: path.resolve('src/assets'),
      components: path.resolve('src/components'),
    },
  },
  devServer: {},
}
