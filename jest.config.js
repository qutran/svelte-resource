module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**'],
  coveragePathIgnorePatterns: ['src/index.js'],
  testPathIgnorePatterns: ['__tests__/fixtures'],
  testRegex: '__tests__/.*.spec.js$',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': 'svelte-jester',
  },
  moduleFileExtensions: ['js', 'svelte'],
};
