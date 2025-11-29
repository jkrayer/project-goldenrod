export default {
  // Use Node environment for backend tests
  testEnvironment: "node",

  // Enable verbose output
  verbose: true,

  // Test file patterns
  testMatch: ["**/__tests__/**/*.test.[jt]s", "**/?(*.)+(spec|test).[jt]s"],

  // Preset for TypeScript with ES modules
  preset: "ts-jest/presets/default-esm",

  // Transform TypeScript files
  extensionsToTreatAsEsm: [".ts"],

  // Module name mapper for path aliases and .js imports
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // Transform configuration for ts-jest
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/**/*.test.{js,ts}",
    "!src/**/*.spec.{js,ts}",
  ],

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
