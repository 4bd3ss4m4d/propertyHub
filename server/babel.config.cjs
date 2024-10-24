module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',  // Ensures compatibility with the current Node.js version
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',  // Optimizes code for async/await and other helpers
  ],
};
