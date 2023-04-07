module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: '3.30.0',
        targets: {
          node: 'current'
        }
      }
    ]
  ]
}
