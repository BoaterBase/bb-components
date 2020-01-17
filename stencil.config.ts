import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'bb-components',
  globalStyle: 'src/global/variables.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  devServer: {
    port: 4444,
    reloadStrategy: 'hmr'
  }
};