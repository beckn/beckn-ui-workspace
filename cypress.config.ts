import { defineConfig } from 'cypress'
import cypressMochawesomeReporter from 'cypress-mochawesome-reporter/plugin'

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    testIsolation: false,
    experimentalRunAllSpecs: true,
    retries: { runMode: 2, openMode: 0 },
    setupNodeEvents(on, config) {
      cypressMochawesomeReporter(on) // 👈 Integrates mochawesome
      return config
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true
    }
  }
})
