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
    });
  }
});

test("autosuggest DOM elements are setup", function(){
  visit('/').then(function() {
    ok(view.$().hasClass('autosuggest'));
    ok(view.$('input.autosuggest').length);
    ok(view.$('ul.selections').length);
    equal(false, view.$('ul.suggestions').is(':visible'), "results ul is initially not displayed");
  });
});

test("a no results message is displayed when there is no source", function(){
  visit('/').then(function(){
    equal(false, view.$('ul.suggestions').is(':visible'), "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'xxxx').then(function(){
    ok(view.$('ul.suggestions').is(':visible'), "results ul is displayed.");
    equal(find('.results .suggestions .no-results').html(), "No Results.", "No results message is displayed.");
  });
});

test("Search results should be filtered", function(){
  equal(get(controller, 'length'), 3, "precon - 3 results exist");

  visit('/').then(function(){
    equal(false, view.$('ul.suggestions').is(':visible'), "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'Paul').then(function(){
    var el = find('.results .suggestions li.result');
    equal(el.length, 1, "1 search result exists");
    equal(el.first().text(), "Paul Cowan", "Results filtered to 1 result.");
  });
});
