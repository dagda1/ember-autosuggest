require('ember-autosuggest/~tests/test_helper');

var view, controller;

module("EmberAutosuggest.AutoSuggestView", {
  setup: function(){
    view = window.EmberAutosuggest.AutoSuggestView.create({});
    controller = Ember.Controller.extend(EmberAutosuggest.AutosuggestControllerMixin).create();
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
  ok(view.$().hasClass('autosuggest'));
  ok(view.$('input.autosuggest').length);
  ok(view.$('ul.selections').length);
  ok(view.$('div.results').length);
  ok(view.$('ul.suggestions').length);
});

test("controller must have autosuggestcontroller mixin.", function(){
  ok(controller instanceof EmberAutosuggest.AutosuggestControllerMixin);
});

test("a no results message is displayed when there is no source", function(){
  fillIn(view, 'input.autosuggest', 'Paul');
  equal($('input.autosuggest').val(), 'Paul');
});
