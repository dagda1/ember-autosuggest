require('ember-autosuggest/~tests/test_helper');

var get = Ember.get,
    set = Ember.set,
    precompileTemplate = Ember.Handlebars.compile;

var App, find, click, fillIn, visit;

var indexController, controller, component, source;

module("Customisations", {
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
        revision: 13,
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
        "    {{#auto-suggest source=content destination=tags minChars=0}}" +
        "      <strong>CHANGED</strong>" +
        "    {{/auto-suggest}}" +
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

test("Can prepend a customisation in each suggestion", function(){
  equal(get(controller, 'content.length'), 3, "precon - 3 possible selections exist");

  visit('/').then(function(){
    equal(Ember.$('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'Paul').then(function(){
    var el = find('.results .suggestions li.result span');
    equal(el.length, 1, "1 search result exists");
    equal(el.text().normalize(), "CHANGED Paul Cowan", "Text prepended to suggestions.");
  });
});

test("Can prepend a customisation to each chosen selection", function(){
  equal(get(controller, 'content.length'), 3, "precon - 3 possible selections exist");

  visit('/').then(function(){
    equal(Ember.$('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'Paul')
  .click('.results .suggestions li.result').then(function(){
    var el = find('.selections li.selection');
    equal(el.length, 1, "1 selection element has been added");
    ok(/CHANGED Paul Cowan/.test(el.text().normalize()), "Text prepended to selections.");
  });
});
