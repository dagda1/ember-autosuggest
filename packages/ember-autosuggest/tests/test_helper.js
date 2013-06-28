/*global wait */
/*global waitFor */
/*global waitForSelector */

var defaultTimeout = 3000;

window.wait = function(timeout, callback) {
  timeout = timeout || defaultTimeout;
  stop();
  return setTimeout(function() {
    start();
    return callback();
  }, timeout);
};

window.waitFor = function(condition, callback, message) {
  var checkCondition, startedAt;
  stop();
  message = message || 'waitFor timed out';
  startedAt = new Date().getTime();
  checkCondition = function() {
    var delta;
    delta = new Date().getTime() - startedAt;
    if (delta > defaultTimeout) {
      start();
      throw new Error(message);
    } else {
      if (condition()) {
        start();
        callback();
      } else {
        return setTimeout(checkCondition, 20);
      }
    }
  };
  return checkCondition();
};

window.waitForSelector = function(view, selector, callback, message) {
  var callbackWithElement, condition;
  message = message || "'" + selector + "' present";
  if (!$.isArray(selector)) {
    selector = [selector];
  }
  condition = function() {
    return $.apply($, selector).length;
  };
  callbackWithElement = function() {
    return wait(10, function() {
      return callback($.apply($, selector));
    });
  };
  return waitFor(condition, callbackWithElement, message);
};

window.fillIn = function(view, selector, text){
  var el = find(view, selector);

  Ember.run(function() {
    el.val(text).change();
  });

  return el;
};

window.find = function(view, selector){
  var el = $(selector);

  if(el.length === 0){
    throw("Element " + selector + " not found.");
  }

  return el;
};
