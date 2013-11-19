/*globals ENV QUnit EmberDev */

(function() {
  window.Ember = {
    testing: true
  };
  window.ENV = window.ENV || {};

  // Test for "hooks in ENV.EMBER_LOAD_HOOKS['hookName'] get executed"
  ENV.EMBER_LOAD_HOOKS = ENV.EMBER_LOAD_HOOKS || {};
  ENV.EMBER_LOAD_HOOKS.__before_ember_test_hook__ = ENV.EMBER_LOAD_HOOKS.__before_ember_test_hook__ || [];
  ENV.__test_hook_count__ = 0;
  ENV.EMBER_LOAD_HOOKS.__before_ember_test_hook__.push(function(object) {
    ENV.__test_hook_count__ += object;
  });

  var extendPrototypes = QUnit.urlParams.exntedprototypes;
  ENV['EXTEND_PROTOTYPES'] = !!extendPrototypes;

  // Handle extending prototypes
  QUnit.config.urlConfig.push('extendprototypes');

  // Don't worry about jQuery version
  ENV['FORCE_JQUERY'] = true;

  if (EmberDev.jsHint) {
    // jsHint makes its own Object.create stub, we don't want to use this
    ENV['STUB_OBJECT_CREATE'] = !Object.create;
  }

  EmberDev.afterEach = Ember.k;

  EmberDev.distros = {
    spade:   'ember-autosuggest-spade.js',
    build:   'ember-autosuggest.js',
    prod:    'ember-autosuggest.prod.js',
    runtime: 'ember-autosuggest-runtime.js'
  };
})();
