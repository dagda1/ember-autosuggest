window.App = Ember.Application.create();

App.AutoSuggestComponent = window.AutoSuggestComponent;

App.FixtureAdapter = DS.FixtureAdapter.extend({
  queryFixtures: function(fixtures, query){
    return fixtures.filter(function(employee){
      var fullName =  employee.firstName + " " + employee.surname;
      return fullName.toLowerCase().search(query.fullName.toLowerCase()) !== -1;
    });
  }
});

App.Store = DS.Store.extend({
  adapter: App.FixtureAdapter.extend({
    simulateRemoteResponse: true,
    latency: 200
  })
});

App.Employee = DS.Model.extend({
  firstName: DS.attr('string'),
  surname: DS.attr('string'),
  age: DS.attr('number'),
  fullName: Ember.computed(function(){
       return this.get('firstName') + " " + this.get('surname');
  }).property('firstName', 'surname'),
  isChecked: false
});

App.Employee.FIXTURES = [
    {
        id: 1,
        firstName: 'Paul',
        surname: 'Cowan',
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
    },

    {
        id: 6,
        firstName: 'Merredith',
        surname: 'Carruthers',
        age: 67
    },
    {
        id: 7,
        firstName: 'Karen',
        surname: 'Jones',
        age: 67
    },
    {
        id: 8,
        firstName: 'Louise',
        surname: 'Patterson',
        age: 67
    },

    {
        id: 9,
        firstName: 'Colin',
        surname: 'Montgommery',
        age: 67
    },

    {
        id: 10,
        firstName: 'Zaul',
        surname: 'Zeneth',
        age: 67
    },
];
