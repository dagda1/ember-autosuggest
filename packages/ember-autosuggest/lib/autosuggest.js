var get = Ember.get,
    set = Ember.set,
    addObserver = Ember.addObserver,
    removeObserver = Ember.removeObserver;

window.AutoSuggestComponent = Ember.Component.extend({
  classNameBindings: [':autosuggest'],
  minChars: 1,
  searchPath: 'name',
  query: null,

  didInsertElement: function(){
    Ember.assert('You must supply a source for the autosuggest component', get(this, 'source'));
    Ember.assert('You must supply a destination for the autosuggest component', get(this, 'destination'));
  },

  addSelection: function(selection){
    set(this, 'query', '');
    get(this, 'destination').pushObject(selection);
  },

  hasQuery: Ember.computed(function(){
    var query = get(this, 'query');

    if(query && query.length > get(this, 'minChars')){
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

  searchResults: Ember.computed(function(){
    var source = get(this, 'source'),
        query = get(this, 'query'),
        self = this;

    if(!source){
      return Ember.A();
    }

    if((!query) || (query.length <= get(this, 'minChars'))){
      return Ember.A();
    }

    this.positionResults();

    var results = source.filter(function(item){
      return item.get(get(self, 'searchPath')).toLowerCase().search(query.toLowerCase()) !== -1;
    }).filter(function(item){
      return get(self, 'destination').map(function(item){
        return get(item, 'data');
      }).indexOf(item) === -1;
    });

    if(get(results, 'length') === 0){
      return Ember.A();
    }

    return Ember.A(results.map(function(item){
      return Ember.Object.create({display: get(item, get(self, 'searchPath')), data: item});
    }));
  }).property('query'),
});
