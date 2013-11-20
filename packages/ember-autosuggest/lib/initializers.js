String.prototype.humanize = function() {
  var str;
  str = this.replace(/_id$/, "").replace(/_/g, ' ').replace(/([a-z\d]*)/gi, function(match) {
    return match.toLowerCase();
  });

  return str.split('.').pop();
};

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "injectStoreIntoAutosuggest",
    after: "store",
    initialize: function(container, application) {
      window.AutoSuggestComponent.reopen({
        store: container.lookup('store:main')
      });

      // FIXME: why does this not work?
      // application.inject('component:auto-suggest', 'store', 'store:main');
    }
  });
});
