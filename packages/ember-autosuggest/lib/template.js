var precompileTemplate = Ember.Handlebars.compile;

Ember.TEMPLATES['components/auto-suggest'] = precompileTemplate(
  "<ul class='selections'>" +
  "{{#each destination}}" +
  "  <li class=\"selection\">" +
  "    <a class=\"as-close\" {{action removeSelection this}}>x</a>" +
  "    {{displayHelper controller.searchPath}}" +
  "  <\/li>" +
  "{{/each}}" +
  "<li>{{view view.autosuggest valueBinding=query class='autosuggest'}}<\/li>" +
  "<\/ul>"+
  "<div {{bindAttr class=':results hasQuery::hdn'}}>" +
     "<ul class='suggestions'>" +
     "{{#each displayResults}}" +
     "  <li {{action addSelection this}} {{bindAttr class=\":result active\"}}>" +
     "    <span>{{displayHelper controller.searchPath}}</span>" +
     "  <\/li>" +
     "{{else}}" +
     " <li class='no-results'>No Results.<\/li>" +
     "{{/each}}" +
     "<\/ul>" +
  "<\/div>"
);
