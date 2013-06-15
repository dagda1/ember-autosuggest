EmberAutosuggest.AutoSuggestView = Ember.View.extend({
  didInsertElement: function(){
    this._super.apply(this, arguments);

    var input = this.$("<input type='text' class='autosuggest'/>");

    this.$().append(input);
  }
});
