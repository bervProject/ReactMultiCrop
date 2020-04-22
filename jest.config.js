module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/src/**/*.{ts,tsx}"
  ],
  coverageDirectory: "./coverage/",
};
