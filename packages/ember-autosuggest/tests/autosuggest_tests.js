require('ember-autosuggest/~tests/test_helper');

var view;

module("EmberAutosuggest.AutoSuggestView", {
  setup: function(){
    view = window.EmberAutosuggest.AutoSuggestView.create({});
    Ember.run(function(){
      view.appendTo('#qunit-fixture');
    });
  },
  teardown: function(){
    Ember.run(function(){
      view.destroy();
    });
  }
});

test("autosuggest DOM elements are setup", function(){
  ok(view.$('div.autosuggest'));
  ok(view.$('input.autosuggest').length);
  ok(view.$('ul.selections').length);
  ok(view.$('div.results').length);
  ok(view.$('ul.suggestions').length);
});

test("a no results message is displayed when there is no source", function(){
  fillIn(view, 'input.autosuggest', 'Paul');
  equal($('input.autosuggest').val(), 'Paul');
});
