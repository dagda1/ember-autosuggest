App.IndexView = Ember.View.extend({
  suggester: EmberAutosuggest.AutoSuggestView.extend({
    sourceBinding: 'controller',
  }),
});
