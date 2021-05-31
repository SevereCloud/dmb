/** @type {import("snowpack").SnowpackUserConfig } */
const pkg = require('./package.json');

module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    [
      '@snowpack/plugin-typescript',
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
      },
    ],
    [
      '@snowpack/plugin-webpack',
      {
        sourceMap: false,
      },
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: 'es2018',
    sourcemap: false,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 10888,
  },
  buildOptions: {
    /* ... */
  },
  env: {
    VERSION: pkg.version,
  },
};
