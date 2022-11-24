import merge  from 'webpack-merge';

import common from './webpack.config';

const config = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.prod.json'
        }
      }
    ]
  }
});

export default config;