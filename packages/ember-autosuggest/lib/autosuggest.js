var get = Ember.get,
    set = Ember.set,
    addObserver = Ember.addObserver,
    removeObserver = Ember.removeObserver;

window.AutoSuggestComponent = Ember.Component.extend({
  classNameBindings: [':autosuggest'],
  minChars: 1,
  searchPath: 'name',
  query: null,
  searchResults: Ember.A(),

  didInsertElement: function(){
    Ember.assert('You must supply a source for the autosuggest component', get(this, 'controller.source'));
    Ember.assert('You must supply a destination for the autosuggest component', get(this, 'controller.destination'));
    addObserver(this, 'query', this.queryDidChange);
  },
  willDestroyElement: function(){
    this._super.apply(this, arguments);
    removeObserver(this, 'query', this.queryDidChange);
  },

  addSelection: function(selection){
    get(this, 'searchResults').clear();
    set(this, 'query', '');
    get(this, 'destination').pushObject(selection);
  },

  hasQuery: Ember.computed(function(){
    var query = get(this, 'query');

    if( query && query.length > get(this, 'minChars')){
      this.positionResults();
      return true;
    }

    return false;
  }).property('query'),

  positionResults: function(){
    var input = this.$('input.autosuggest');
    var results = this.$('ul.suggestions');
    var selections = this.$('ul.selections');
    var position = input.position();
    results.css('position', 'absolute');
    results.css('left', position.left);
    results.css('top', position.top + input.height() + 7);
    results.css('width', this.$('ul.selections').outerWidth() - position.left);
  },

  queryDidChange: function(){
    var source = get(this, 'source'),
        query = get(this, 'query'),
        self = this,
        searchResults = get(this, 'controller.searchResults');

    searchResults.clear();

    if(!source){
      return;
    }

    if(query.length <= get(this, 'minChars')){
      return;
    }

    this.positionResults();

    //TODO: filter out selected results
    var results = source.filter(function(item){
      return item.get(get(self, 'searchPath')).toLowerCase().search(query.toLowerCase()) !== -1;
    }).filter(function(item){
      return get(self, 'controller.destination').map(function(item){
        return get(item, 'data');
      }).indexOf(item) === -1;
    });

    if(get(results, 'length') === 0){
      return;
    }

    searchResults.pushObjects(results.map(function(item){
      return Ember.Object.create({display: get(item, get(self, 'searchPath')), data: item});
    }));
  },
});
