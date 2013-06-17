window.fillIn = function(view, selector, text){
  var el = find(view, selector);

  //keyup with any char to trigger bindings sync
  var event = jQuery.event('keyup');

  event.keyCode = 46;

  Ember.run(function(){
    el.val(text).trigger(event);
  });

  return el;
};

window.find = function(view, selector){
  var el = view.$(selector);

  if(el.length === 0){
    throw("Element " + selector + " not found.");
  }

  return el;
};
