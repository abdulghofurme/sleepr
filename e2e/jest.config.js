// jest.config.js
export default {
  preset: 'ts-jest/presets/default-esm', // for ESM support
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json', // or path to your test tsconfig
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // optional fix for path resolution in ESM
  },
  testTimeout: 10000,
};
