var get = Ember.get,
    set = Ember.set,
    setEach = Ember.setEach,
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
    get(this, 'destination').addObject(selection);
    set(this, 'selectionIndex', -1);
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

  removeSelection: function(item){
    get(this, 'destination').removeObject(item);
  },

  searchResults: Ember.computed(function(){
    var source = get(this, 'source'),
        query = get(this, 'query'),
        self = this;

    if((!query) || (query.length <= get(this, 'minChars'))){
      set(this, 'selectionIndex', -1);
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
    })).sort(function(a, b){
      return Ember.compare(get(a, 'display'), get(b, 'display'));
    });
  }).property('query'),

  selectionIndex: -1,

  moveSelection: function(direction){
    var selectionIndex = get(this, 'selectionIndex'),
        isUp = direction === 'up',
        isDown = !isUp,
        searchResultsLength = get(this, 'searchResults.length');

    get(this, 'searchResults').setEach('active', false); 

    if(!searchResultsLength){
      set(this, 'selectionIndex', -1);
      return;
    }

    if(isUp && selectionIndex <= 0){
      selectionIndex =  0;
    }
    else if(isDown && selectionIndex === searchResultsLength -1){
      selectionIndex = searchResultsLength -1;
    }else if(isDown){
      selectionIndex++;
    }else{
      selectionIndex--;
    }

    var active = get(this, 'searchResults').objectAt(selectionIndex);

    set(this, 'selectionIndex', selectionIndex);

    set(active, 'active', true);
  },

  selectActive: function(){
    var selectionIndex = get(this, 'selectionIndex'),
        searchResultsLength = get(this, 'searchResults.length');

    if(!searchResultsLength){
      return;
    }

    var active = get(this, 'searchResults').find(function(item){
      return get(item, 'active');
    });

    if(!active){
      return;
    }

    this.addSelection(active);
  },

  autosuggest: Ember.TextField.extend({
    KEY_DOWN: 40,
    KEY_UP: 38,
    COMMA: 188,
    TAB: 9,
    ENTER: 13,

    init: function(){
      this._super.apply(this, arguments);
      this.set('allowedKeyCodes', [this.KEY_UP, this.KEY_DOWN, this.COMMA, this.TAB, this.ENTER]);
    },

    keyDown: function(e){
      var keyCode = e.keyCode;

      if(!this.get('allowedKeyCodes').contains(keyCode)){
        return;
      }

      switch(keyCode){
        case this.KEY_UP:
          get(this, 'controller').moveSelection('up');
          break;
        case this.KEY_DOWN:
          get(this, 'controller').moveSelection('down');
          break;
        case this.ENTER:
          get(this, 'controller').selectActive(); 
          break;
        default:
          console.log(keyCode);
      }
    },
  }),
});
