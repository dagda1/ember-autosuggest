var precompileTemplate = Ember.Handlebars.compile,
    get = Ember.get,
    set = Ember.set,
    addObserver = Ember.addObserver,
    removeObserver = Ember.removeObserver;

EmberAutosuggest.AutoSuggestView = Ember.View.extend({
  classNameBindings: [':autosuggest'],
  minChars: 1,
  source: Ember.computed(function(){
    source = get('controller.source');
    if((!source) || (!get(source, 'length'))){
      return [];
    }

    return source;
  }).property('controller.source.[]'),

  defaultTemplate: precompileTemplate("<ul class='selections'>" +
                                        "<li>{{view view.autosuggest}}<\/li>" +
                                      "<\/ul>"+
                                      "<div class='results'>" +
                                         "<ul class='suggestions'>" +
                                         "{{#each searchResults}}" +
                                         "  <li>Some result<\/li>" +
                                         "{{else}}" +
                                         " <li class='no-results'>No Results.<\/li>" +
                                         "{{/each}}" +
                                         "<\/ul>" +
                                      "<\/div>"),

  autosuggest: Ember.TextField.extend({
    classNameBindings: [':autosuggest'],
    didInsertElement: function(){
      addObserver(this, 'value', this.valueDidChange);
    },
    willDestroyElement: function(){
      this._super.apply(this, arguments);
      removeObserver(this, 'value', this.valueDidChange);
    },
    valueDidChange: function(){
      var value = get(this, 'value');
      if(value.length <= get(this, 'parentView.minChars')){
        return;
      }
      console.log(value);
    }
  }),
});
