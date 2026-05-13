const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({

  e2e: {

    specPattern: "cypress/e2e/**/*.cy.js",

    chromeWebSecurity: false,

    watchForFileChanges: false,

    defaultCommandTimeout: 10000,

    pageLoadTimeout: 120000,

    //video: true,

    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {

      allureCypress(on, config);

      return config;
    },
  },
});