var precompileTemplate = Ember.Handlebars.compile;

window.EmberAutosuggest.AutoSuggestView = Ember.View.extend({
  classNameBindings: [':autosuggest'],
  defaultTemplate: precompileTemplate("<ul class='selections'>" + 
                                        "<li>{{view view.autosuggest}}<\/li>" + 
                                      "<\/ul>"+ 
                                      "<div class='results'>" + 
                                         "<ul class='suggestions'><li class='no-results'>No Results.<\/ul>" + 
                                      "<\/div>"),

  autosuggest: Ember.TextField.extend({
    classNameBindings: [':autosuggest'],
  })
});
