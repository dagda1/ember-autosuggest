var get = Ember.get,
    set = Ember.set;

window.EmberAutosuggest.AutosuggestControllerMixin = Ember.Mixin.create({
  searchResults: Ember.A(),
  autosuggestSelections: Ember.A(),
  query: null,

  addSelection: function(selection){
    get(this, 'searchResults').clear();
    set(this, 'query', '');
    get(this, 'autosuggestSelections').pushObject(selection);
  },
});
