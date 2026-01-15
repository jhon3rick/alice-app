import type { Configuration } from 'webpack';
import path from 'path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.s[ac]ss$/i,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {
      loader: 'sass-loader',
      options: {
        sassOptions: {
          includePaths: [path.resolve(__dirname, 'src/renderer')],
        },
      },
    },
  ],
});

rules.push({
  test: /\.svg$/,
  type: 'asset/source',
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.svg'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@main': path.resolve(__dirname, 'src/main'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@presentation': path.resolve(__dirname, 'src/renderer/presentation'),
      '@components': path.resolve(__dirname, 'src/renderer/presentation/components'),
      '@contexts': path.resolve(__dirname, 'src/renderer/presentation/contexts'),
      '@views': path.resolve(__dirname, 'src/renderer/presentation/views'),
      '@store': path.resolve(__dirname, 'src/renderer/presentation/store'),
      '@tstypes': path.resolve(__dirname, 'src/renderer/presentation/tstypes'),
      '@utils': path.resolve(__dirname, 'src/renderer/presentation/utils'),
      '@const': path.resolve(__dirname, 'src/renderer/presentation/const'),
      '@ui': path.resolve(__dirname, 'src/renderer/presentation/ui'),
      '@styles': path.resolve(__dirname, 'src/renderer/presentation/styles'),
      '@assets': path.resolve(__dirname, 'src/renderer/presentation/assets'),
    },
  },
};
