require('ember-autosuggest/~tests/test_helper');

var get = Ember.get,
    set = Ember.set,
    precompileTemplate = Ember.Handlebars.compile;

var App, find, click, fillIn, visit;

var indexController, controller, component, source;

module("AutoSuggestComponent", {
  setup: function(){
    Ember.$('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 384px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
    Ember.$('<style>.hdn{ display: none; }ul.suggestions{ border: 1px solid red; }</style>').appendTo('head');
    Ember.$('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');

    indexController = Ember.ArrayController.extend({
      init: function(){
        this._super.apply(this, arguments);
        set(this, 'content',  Ember.A([
          Ember.Object.create({id: 1, name: "Bob Hoskins"}),
          Ember.Object.create({id: 2, name: "Michael Collins"}),
          Ember.Object.create({id: 3, name: "Paul Cowan"}),
        ]));

        set(this, 'tags', Ember.ArrayProxy.create({content: Ember.A()}));
      }
    });

    Ember.run(function() {
      window.App = App = Ember.Application.create({
        rootElement: '#ember-testing'
      });

      App.Store = DS.Store.extend({
        adapter: DS.FixtureAdapter.extend({
          simulateRemoteResponse: true,
          latency: 200
        })
      });

      Ember.TEMPLATES.application = precompileTemplate(
        "{{outlet}}"
      );

      Ember.TEMPLATES.index = precompileTemplate(
        "<div id='ember-testing-container'>" +
        "  <div id='ember-testing'>" + 
        "    {{auto-suggest source=model destination=tags minChars=0}}" +
        "  </div>" +
        "</div>"
      );

      App.AutoSuggestComponent = window.AutoSuggestComponent;
      App.IndexController = indexController;

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

    // FIXME: Is there a cleaner way of getting the instances 
    controller = App.__container__.lookup('controller:index');
    component = App.__container__.lookup('component:autoSuggest');
  },
  teardown: function(){
    Ember.TEMPLATES = {};
    Ember.run(function(){
      get(controller, 'tags').clear();
    });
    App.removeTestHelpers();
    Ember.$('#ember-testing-container, #ember-testing').remove();
    Ember.run(App, App.destroy);
    App = null;
  }
});

test("autosuggest DOM elements are setup", function(){
  expect(4);
  visit('/').then(function() {
    ok(Ember.$('div.autosuggest'), "autosuggest component in view");
    ok(Ember.$('input.autosuggest').length, "suggestion input in DOM.");
    ok(Ember.$('ul.selections').length, "selections ul in DOM");
    equal(Ember.$('ul.suggestions').is(':visible'), false, "results ul is initially not displayed");
  });
});

test("a no results message is displayed when no match is found", function(){
  expect(3);

  visit('/').then(function(){
    equal(Ember.$('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'xxxx').then(function(){
    ok(Ember.$('ul.suggestions').is(':visible'), "results ul is displayed.");
    equal(find('.results .suggestions .no-results').html(), "No Results.", "No results message is displayed.");
  });
});

test("Search results should be filtered", function(){
  expect(4);

  equal(get(controller, 'content.length'), 3, "precon - 3 possible selections exist");

  visit('/').then(function(){
    equal(Ember.$('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'Paul').then(function(){
    var el = find('.results .suggestions li.result span');
    equal(el.length, 1, "1 search result exists");
    equal(el.text().trim(), "Paul Cowan", "1 search result is visible.");
  });
});

test("A selection can be added", function(){
  expect(6);

  equal(get(controller, 'tags.length'), 0, "precon - no selections have been added.");
  visit('/')
  .fillIn('input.autosuggest', 'Paul')
  .click('.results .suggestions li.result').then(function(){
    equal(get(controller, 'tags.length'), 1, "1 selection has been added.");
    var el = find('.selections li.selection');
    equal(el.length, 1, "1 selection element has been added");
    ok(/Paul Cowan/.test(el.first().text()), "Correct text displayed in element.");
    var suggestions = find('.results .suggestions li.result');
    equal(suggestions.length, 0, "No suggestions are visible.");
    var noResults = find('.suggestions .no-results');
    equal(noResults.is(':visible'), false, "No results message is not displayed.");
  });
});

test("Don't display a suggestion that has already been selected", function(){
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

test("A selection can be removed", function(){
  expect(4);

  visit('/')
  .fillIn('input.autosuggest', 'Paul')
  .click('.results .suggestions li.result').then(function(){
    var el = find('.selections li.selection');
    equal(el.length, 1, "precon - 1 selection element has been added");
    var close = find('.as-close');
    equal(close.length, 1, "precon - only one close link is on the page");
  }).click('.as-close').then(function(){
    var el = find('.selections li.selection');
    equal(el.length, 0, "precon - there are now no suggestions after removeSelection.");
    equal(get(controller, 'tags.length'), 0, "The controller has 0 tags after removeSelection.");
  });
});

test("key down and key up change the active elemnt", function(){
  visit('/')
  .fillIn('input.autosuggest', 'a')
  .keyEvent('input.autosuggest', 'keydown', 40).then(function(){
    var active = find('.results li.result.active');

    equal(1, active.length, "only one element is active");
    equal("Michael Collins", active.text().trim(), "Correct result is highlighted");
  }).keyEvent('input.autosuggest', 'keydown', 40).then(function(){
    var active = find('.results li.result.active');

    equal(1, active.length, "only one element is active");
    equal("Paul Cowan", active.text().trim(), "Correct result is highlighted");
  }).keyEvent('input.autosuggest', 'keydown', 38).then(function(){
    var active = find('.results li.result.active');

    equal(1, active.length, "only one element is active");
    equal("Michael Collins", active.text().trim(), "Correct result is highlighted");
  });
});

test("pressing enter on a selected item adds the selection to the destination", function(){
  visit('/')
  .fillIn('input.autosuggest', 'Michael')
  .keyEvent('input.autosuggest', 'keydown', 40).then(function(){
    var active = find('.results li.result.active');

    equal(1, active.length, "only one element is active");
    equal("Michael Collins", active.text().trim(), "Correct result is highlighted");
  }).keyEvent('input.autosuggest', 'keydown', 13).then(function(){
    equal(get(controller, 'tags.length'), 1, "1 selection has been added.");
    var el = find('.selections li.selection');
    equal(el.length, 1, "1 selection element has been added");
    ok(/Michael Collins/.test(el.first().text()), "Correct text displayed in element.");
  });
});
