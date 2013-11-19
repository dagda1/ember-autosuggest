App.IndexController = Ember.ArrayController.extend({
  tags: Ember.A(),
  carsOwned: Ember.A(),
  chosenEmployees: Ember.A(),
  dsChosenEmployees: Ember.A(),
  employees: Ember.computed(function(){
    return this.get('store').find('employee');
  }).property(),
  init: function(){  
    this._super.apply(this, arguments);
    this.set('content',  Ember.A([
      Ember.Object.create({id: 1, name: "Odds"}),
      Ember.Object.create({id: 2, name: "Ends"}),
      Ember.Object.create({id: 3, name: "Cooking"}),
      Ember.Object.create({id: 4, name: "Cleaning"}),
      Ember.Object.create({id: 5, name: "Construction"}),
      Ember.Object.create({id: 6, name: "IT"}),
      Ember.Object.create({id: 7, name: "Vegetagbles"}),
      Ember.Object.create({id: 8, name: "Flora"}),
      Ember.Object.create({id: 9, name: "Fauna"}),
      Ember.Object.create({id: 10, name: "Bric-a-Brac"}),
      Ember.Object.create({id: 11, name: "Misc"}),
      Ember.Object.create({id: 12, name: "Frogs"}),
      Ember.Object.create({id: 13, name: "Apples"}),
      Ember.Object.create({id: 14, name: "Buses"}),
      Ember.Object.create({id: 15, name: "Candy"}),
      Ember.Object.create({id: 16, name: "Dentists"}),
      Ember.Object.create({id: 17, name: "Earywigs"}),
      Ember.Object.create({id: 18, name: "Flutes"}),
      Ember.Object.create({id: 19, name: "Goats"}),
      Ember.Object.create({id: 20, name: "Harrington Coats"}),
      Ember.Object.create({id: 21, name: "Indigenous Goats"}),
      Ember.Object.create({id: 22, name: "Jackets"}),
      Ember.Object.create({id: 23, name: "Kennels"}),
      Ember.Object.create({id: 24, name: "Merengues"}),
      Ember.Object.create({id: 25, name: "Nothings"}),
      Ember.Object.create({id: 26, name: "Obelisks"}),
      Ember.Object.create({id: 27, name: "Police"}),
      Ember.Object.create({id: 28, name: "Universities"}),
      Ember.Object.create({id: 29, name: "Variety"}),
      Ember.Object.create({id: 30, name: "Wombles"}),
      Ember.Object.create({id: 31, name: "Xenophobes"}),
      Ember.Object.create({id: 32, name: "Yaks"}),
      Ember.Object.create({id: 33, name: "Zebras"}),
    ]));

    this.set('cars',  Ember.A([
      Ember.Object.create({id: 1, make: "Alpha Romero"}),
      Ember.Object.create({id: 2, make: "Porche"}),
      Ember.Object.create({id: 3, make: "Austin Martin"}),
      Ember.Object.create({id: 4, make: "Lamborghini"}),
      Ember.Object.create({id: 5, make: "Chevrolet"}),
    ]));
  }
});
