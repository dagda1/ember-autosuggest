require('ember-autosuggest/~tests/test_helper');

var get = Ember.get,
    set = Ember.set;

var App, find, click, fillIn, visit;

var view, controller, source;

module("EmberAutosuggest.AutoSuggestView", {
  setup: function(){
    Ember.$('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 384px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
    Ember.$('<style>.hdn{ display: none; }ul.suggestions{ border: 1px solid red; }</style>').appendTo('head');
    Ember.$('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');
    Ember.run(function() {
      App = Ember.Application.create({
        rootElement: '#ember-testing'
      });

      App.Router.map(function() {
        this.route('index', {path: '/'});
      });

      App.setupForTesting();
    });

    Ember.run(function(){
      App.advanceReadiness();
    });

    App.injectTestHelpers();

    find = window.find;
    click = window.click;
    fillIn = window.fillIn;
    visit = window.visit;

    controller = Ember.ArrayController.extend(EmberAutosuggest.AutosuggestControllerMixin).create();

    controller.set('content',  Ember.A([
      Ember.Object.create({id: 1, name: "Bob Hoskins"}),
      Ember.Object.create({id: 2, name: "Michael Collins"}),
      Ember.Object.create({id: 3, name: "Paul Cowan"}),
    ]));

    view = EmberAutosuggest.AutoSuggestView.createWithMixins({
      source: Ember.computed.alias('controller.content')
    });

    set(view, 'controller', controller);

    Ember.run(function(){
      view.appendTo('#ember-testing');
    });
  },
  teardown: function(){
    App.removeTestHelpers();
    Ember.$('#ember-testing-container, #ember-testing').remove();
    Ember.run(App, App.destroy);
    App = null;
    Ember.run(function(){
      view.destroy();
      get(controller, 'autosuggestSelections').clear();
    });
  }
});

test("autosuggest DOM elements are setup", function(){
  expect(4);

  visit('/').then(function() {
    ok(view.$().hasClass('autosuggest'), "Main view has autosuggest class");
    ok(view.$('input.autosuggest').length, "suggestion input in DOM.");
    ok(view.$('ul.selections').length, "selections ul in DOM");
    equal(view.$('ul.suggestions').is(':visible'), false, "results ul is initially not displayed");
  });
});

test("a no results message is displayed when there is no source", function(){
  expect(3);

  visit('/').then(function(){
    equal(view.$('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'xxxx').then(function(){
    ok(view.$('ul.suggestions').is(':visible'), "results ul is displayed.");
    equal(find('.results .suggestions .no-results').html(), "No Results.", "No results message is displayed.");
  });
});

test("Search results should be filtered", function(){
  expect(5);

  equal(get(controller, 'length'), 3, "precon - 3 possible selections exist");

  visit('/').then(function(){
    equal(view.$('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'Paul').then(function(){
    equal(get(controller, 'searchResults.length'), 1, "Results filtered to 1 result.");
    var el = find('.results .suggestions li.result');
    equal(el.length, 1, "1 search result exists");
    equal(el.first().text(), "Paul Cowan", "1 search result is visible.");
  });
});

test("A selection can be added", function(){
  expect(6);

  equal(get(controller, 'autosuggestSelections.length'), 0, "precon - no selections have been added.");
  visit('/')
  .fillIn('input.autosuggest', 'Paul')
  .click('.results .suggestions li.result').then(function(){
    equal(get(controller, 'autosuggestSelections.length'), 1, "1 selection has been added.");
    var el = find('.selections li.selection');
    equal(el.length, 1, "1 selection element has been added");
    equal(el.first().text(), "Paul Cowan", "Correct text displayed in element.");
    var suggestions = find('.results .suggestions li.result');
    equal(suggestions.length, 0, "No suggestions are visible.");
    var noResults = find('.suggestions .no-results');
    equal(noResults.is(':visible'), false, "No results message is not displayed.");
  });
});

test("Don't display a suggestion that has been selected", function(){
  expect(3);

  visit('/')
  .fillIn('input.autosuggest', 'Paul')
  .click('.results .suggestions li.result').then(function(){
    var el = find('.selections li.selection');
    equal(el.length, 1, "precon - 1 selection element has been added");
  }).fillIn('input.autosuggest', 'Paul').then(function(){
    var suggestions = find('.results .suggestions li.result');
    equal(suggestions.length, 0, "no suggestion for selected item.");
    equal(find('.results .suggestions .no-results').html(), "No Results.", "No results message is displayed.");
  });
});
