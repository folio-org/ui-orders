module.exports = {
  okapi: {
    // application gateway (Kong URL)
    url: "https://folio-snapshot-2.dev.folio.org",

    // UI bundle URL
    uiUrl: "http://localhost:3000",

    // authentication gateway (Keycloak URL)
    authnUrl: "https://folio-snapshot-2.dev.folio.org",

    // request timeout in milliseconds
    // default: 30000
    // since P
    timeout: 30000,
  },
  config: {
    disableStrictMode: true,
    // act as though user has all perms, i.e. <IfPermission> always returns true
    // default: FALSE
    // since A
    hasAllPerms: true,

    // locale to use for the login page, prior to authenticating
    // default: en-US
    // since R
    locale: "en-US",

    // stripes logger categories
    // since A
    logCategories: "core,path,action,xhr",
    logPrefix: "--",

    // lookup table rows to retrieve en-masse
    maxUnpagedResourceCount: 2000,

    // prevent the console from being cleared on logout
    // default: FALSE
    // since Q
    preserveConsole: true,

    // list permissions in the userprofile menu?
    // default: FALSE
    // since A
    showPerms: true,

    // true to hide verbose react-intl complaints
    // default: false
    suppressIntlErrors: true, // since H
    suppressIntlWarnings: true, // since O

    // Since Ramsons R2
    // use instead of okapi.tenant
    tenantOptions: {
      diku: { name: "diku", clientId: "diku-application" },
    },

    // use RTR instead of insecure legacy endpoints
    // since Q, default: FALSE
    // since S, default: TRUE, cannot be overridden
    useSecureTokens: true,

    // RTR customization
    rtr: {
      // how long before an idle session is killed? default: 60m
      // must be a string parseable by ms, e.g. 30s, 10m, 1h
      idleSessionTTL: "10m",

      // how long to show the "warning, session is idle" modal? default: 1m
      // must be a string parseable by ms, e.g. 30s, 10m, 1h
      idleModalTTL: "2m",

      // which events constitute "activity" that prolongs a session?
      // default: keydown, mousedown
      activityEvents: ["keydown", "mousedown", "wheel", "touchstart", "scroll"],

      // how long is the "your session will end!" warning shown
      // before the session is, in fact, killed? default: 1m
      // must be a string parseable by ms, e.g. 30s, 10m, 1h
      fixedLengthSessionWarningTTL: "2m",
    },
    autoLogin: { username: "diku_admin", password: "admin" },
  },
  modules: {},
};
