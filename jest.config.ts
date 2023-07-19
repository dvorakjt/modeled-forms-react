import type { Config } from 'jest';

const config : Config = {
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    './src/components/**',
    './src/hooks/**',
    './src/model/**'
  ], 
  coverageThreshold: { 
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}

export default config;