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

test("autosuggest input is rendered", function(){
  ok(view.$('input.autosuggest'));
});

test("autosuggest DOM elements are setup", function(){
  ok(view.$('div.autosuggest'));
  ok(view.$('ul.selections'));
});
