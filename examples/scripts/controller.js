App.IndexController = Ember.ArrayController.extend(EmberAutosuggest.AutosuggestControllerMixin,{
  init: function(){  
    this._super.apply(this, arguments);
    this.set('content',  Ember.A([
        Ember.Object.create({id: 1, name: "Bob Hoskins"}),
        Ember.Object.create({id: 2, name: "Michael Collins"}),
        Ember.Object.create({id: 3, name: "Paul Cowan"}),
        Ember.Object.create({id: 4, name: "Paul Jones"}),
    ]));
  }
});
