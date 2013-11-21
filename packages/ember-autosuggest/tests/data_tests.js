require('ember-autosuggest/~tests/test_helper');

var get = Ember.get,
    set = Ember.set,
    precompileTemplate = Ember.Handlebars.compile;

var App, find, click, fillIn, visit;

var indexController, controller, component, source;

module("Ember.Data source tests", {
  setup: function(){
    Ember.$('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 384px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
    Ember.$('<style>.hdn{ display: none; }ul.suggestions{ border: 1px solid red; }</style>').appendTo('head');
    Ember.$('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');

    indexController = Ember.ArrayController.extend({
      init: function(){
        this._super.apply(this, arguments);
        set(this, 'content',  Ember.A([]));
        set(this, 'chosenEmployees', Ember.ArrayProxy.create({content: Ember.A()}));
      }
    });

    Ember.run(function() {
      window.App = App = Ember.Application.create({
        rootElement: '#ember-testing'
      });

      App.FixtureAdapter = DS.FixtureAdapter.extend();

      App.Store = DS.Store.extend({
        adapter: App.FixtureAdapter.extend({
          simulateRemoteResponse: true
          //latency: 200
        })
      });

      App.Employee = DS.Model.extend({
        firstName: DS.attr('string'),
        surname: DS.attr('string'),
        age: DS.attr('number'),
        fullName: Ember.computed(function(){
             return this.get('firstName') + " " + this.get('surname');
        }).property('firstName', 'surname'),
      });

      App.Employee.FIXTURES = [
        {
            id: 1,
            firstName: 'Carol',
            surname: 'Bazooka',
            age: 42
        },
        {
            id: 2,
            firstName: 'Bob',
            surname: 'Smith',
            age: 67
        },
        {
            id: 3,
            firstName: 'Michael',
            surname: 'Carruthers',
            age: 67
        },
        {
            id: 4,
            firstName: 'Patrick',
            surname: 'Bateman',
            age: 67
        },
        {
            id: 5,
            firstName: 'Tim',
            surname: 'Price',
            age: 67
        }
      ];

      App.FixtureAdapter.reopen({
        queryFixtures: function(fixtures, query){
          return fixtures.filter(function(employee){
            var fullName =  employee.firstName + " " + employee.surname;
            return fullName.toLowerCase().search(query.fullName.toLowerCase()) !== -1;
          });
        }
      });

      Ember.TEMPLATES.application = precompileTemplate(
        "{{outlet}}"
      );

      Ember.TEMPLATES.index = precompileTemplate(
        "<div id='ember-testing-container'>" +
        "  <div id='ember-testing'>" + 
        "    {{auto-suggest source=App.Employee destination=chosenEmployees searchPath=\"fullName\" minChars=0}}" +
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
      get(controller, 'chosenEmployees').clear();
    });
    App.removeTestHelpers();
    Ember.$('#ember-testing-container, #ember-testing').remove();
    Ember.run(App, App.destroy);
    App = null;
  }
});

test("Search results should be filtered and visible", function(){
  expect(4);

  visit('/').then(function(){
    equal(Ember.$('ul.suggestions').is(':visible'), false, "precon - results ul is initially not displayed");
  })
  .fillIn('input.autosuggest', 'Carol').then(function(){
    ok(Ember.$('ul.suggestions').is(':visible'), "results ul is displayed.");
    var el = find('.results .suggestions li.result span');
    equal(el.length, 1, "1 search result exists");
    equal(el.text().trim(), "Carol Bazooka", "1 search result is visible.");
  });
});

test("A chosen selection is added to the destination", function(){
  visit('/')
  .fillIn('input.autosuggest', 'Carol')
  .click('.results .suggestions li.result').then(function(){
    equal(get(controller, 'chosenEmployees.length'), 1, "1 selection has been added.");
    var el = find('.selections li.selection');
    equal(el.length, 1, "1 selection element has been added");
    ok(/Carol Bazooka/.test(el.first().text()), "Correct text displayed in element.");
    var suggestions = find('.results .suggestions li.result');
    equal(suggestions.length, 0, "No suggestions are visible.");
    var noResults = find('.suggestions .no-results');
    equal(noResults.is(':visible'), false, "No results message is not displayed.");
  });
});
