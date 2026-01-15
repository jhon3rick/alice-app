import type { Configuration } from 'webpack';
import path from 'path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
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
  externals: {
    'node-pty': 'commonjs2 node-pty',
  },
};
