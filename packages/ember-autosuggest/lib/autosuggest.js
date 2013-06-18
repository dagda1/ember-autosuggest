window.EmberAutosuggest.AutoSuggestView = Ember.View.extend({
  classNameBindings: [':autosuggest'],
  template: Ember.Handlebars.compile("<ul class='selections'><li>{{view view.autosuggest}}<\/li><\/ul><div class='results'><ul class='suggestions'><\/ul><\/div>"),

  autosuggest: Ember.TextField.extend({
    classNameBindings: [':autosuggest'],
  })
});
