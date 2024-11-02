module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      },
    }],
  ],
  plugins: [
    ['module-resolver', {
      root: ['.'],
      alias: {
        '@': '.',
        '__tests__': './__tests__',
      },
    }],
  ],
};
