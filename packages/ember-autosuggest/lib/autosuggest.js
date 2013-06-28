var precompileTemplate = Ember.Handlebars.compile,
    get = Ember.get,
    set = Ember.set,
    addObserver = Ember.addObserver,
    removeObserver = Ember.removeObserver;

EmberAutosuggest.AutoSuggestView = Ember.View.extend({
  classNameBindings: [':autosuggest'],
  minChars: 1,
  searchPath: 'name',

  defaultTemplate: precompileTemplate("<ul class='selections'>" +
                                        "<li>{{view view.autosuggest}}<\/li>" +
                                      "<\/ul>"+
                                      "<div class='results'>" +
                                         "<ul class='suggestions'>" +
                                         "{{#each searchResults}}" +
                                         "  <li class=\"result\">{{display}}<\/li>" +
                                         "{{else}}" +
                                         " <li class='no-results'>No Results.<\/li>" +
                                         "{{/each}}" +
                                         "<\/ul>" +
                                      "<\/div>"),

  autosuggest: Ember.TextField.extend({
    classNameBindings: [':autosuggest'],
    searchPathBinding: 'parentView.searchPath',
    sourceBinding: 'parentView.source',

    didInsertElement: function(){
      addObserver(this, 'value', this.valueDidChange);
    },
    willDestroyElement: function(){
      this._super.apply(this, arguments);
      removeObserver(this, 'value', this.valueDidChange);
    },
    valueDidChange: function(){
      var source = get(this, 'source'),
          value = get(this, 'value'),
          self = this,
          searchResults = get(this, 'controller.searchResults');

      searchResults.clear();

      if(!source){
        return;
      }

      if(value.length <= get(this, 'parentView.minChars')){
        return;
      }

      //TODO: filter out selected results
      var results = source.filter(function(item){
        return item.get(get(self, 'searchPath')).toLowerCase().search(value.toLowerCase()) !== -1;
      });

      if(get(results, 'length') === 0){
        return;
      }

      searchResults.pushObjects(results.map(function(item){
        return Ember.Object.create({display: get(item, get(self, 'searchPath')), data: item});
      }));
    }
  }),
});
