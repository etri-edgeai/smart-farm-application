/* eslint-disable */
export default {
  displayName: 'api-e2e',

  globals: {},
  testEnvironment: 'node',
  testMatch: ['**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/../tsconfig.e2e-spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../../coverage/apps/api-e2e',
  preset: '../../../jest.preset.js',
};
