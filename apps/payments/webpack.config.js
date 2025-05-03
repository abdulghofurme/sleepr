const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (config) => {
  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/templates'),
          to: path.resolve(__dirname, '../../dist/apps/payments/templates'),
        },
      ],
    }),
  );
  return config;
};
