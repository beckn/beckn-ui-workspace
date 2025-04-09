import { defineConfig } from 'cypress'
import cypressMochawesomeReporter from 'cypress-mochawesome-reporter/plugin'

export default defineConfig({
  e2e: {
    testIsolation: false,
    experimentalRunAllSpecs: true,
    retries: { runMode: 2, openMode: 0 },
    setupNodeEvents(on, config) {
      // Load required vars into Cypress runtime environment
      config.env.CYPRESS_BASE_URL = process.env.CYPRESS_BASE_URL || 'http://localhost:3000'

      cypressMochawesomeReporter(on, config) // 👈 Integrates mochawesome
      return config
    },
    reporter: 'cypress-mochawesome-reporter'
  }
})
