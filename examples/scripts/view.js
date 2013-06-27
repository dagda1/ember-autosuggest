App.IndexView = Ember.View.extend({
  suggester: EmberAutosuggest.AutoSuggestView.extend({
    didInsertElement: function(){
      this._super.apply(this, arguments);
    },
  })
});
