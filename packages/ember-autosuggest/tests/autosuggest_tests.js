require('ember-autosuggest/~tests/test_helper');

var get = Ember.get,
    set = Ember.set;

var view, controller, source;

module("EmberAutosuggest.AutoSuggestView", {
  setup: function(){
    view = EmberAutosuggest.AutoSuggestView.create();
    controller = Ember.ArrayController.extend(EmberAutosuggest.AutosuggestControllerMixin).create();
    set(view, 'controller', controller);
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

test("a no results message is displayed when there is no source", function(){
  fillIn(view, 'input.autosuggest', 'Paul');
  var el = find(view, '.results .suggestions .no-results');
  waitForSelector(view, '.results .suggestions .no-results', function(el){
    equal(el.html(), "No Results.", "No results message is displayed.");
  }, "No results message element cannot be found");
});

module("Search results", {
  setup: function(){
    controller = Ember.ArrayController.extend(EmberAutosuggest.AutosuggestControllerMixin).create();
    controller.set('content', Ember.A([
        Ember.Object.create({id: 1, name: "Bob Hoskins"}),
        Ember.Object.create({id: 2, name: "Michael Collins"}),
        Ember.Object.create({id: 3, name: "Paul Cowan"}),
    ]));
    view = EmberAutosuggest.AutoSuggestView.create();
    set(view, 'controller', controller);
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

test("A source for searching can be recognised", function(){
  equal(get(controller, 'length'), 3, "precon - 3 results exist");

  fillIn(view, 'input.autosuggest', 'Paul');
  waitForSelector(view, '.results .suggestions li.result', function(el){
    equal(el.length, 1, "1 search result exists");
    equal(el.first().html(), "Paul Cowan", "Results filtered to 1 result.");
  }, "1 result element cannot be found");
});
