var get = Ember.get,
    set = Ember.set;

Ember.Handlebars.registerBoundHelper('displayHelper', function(searchPath, options) {
  return new Handlebars.SafeString(get(this, searchPath));
});
