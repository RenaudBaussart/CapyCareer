/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  
  testEnvironment: "node",
  
  setupFilesAfterEnv: [
    "<rootDir>/tests/setup.ts"
  ],
  
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Rapport de Tests - CapyCarrer",
        outputPath: "./rapport-tests.html",
        includeFailureMsg: true,
        includeConsoleLog: false
      }
    ]
  ]
};