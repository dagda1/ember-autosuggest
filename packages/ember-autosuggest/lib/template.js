var precompileTemplate = Ember.Handlebars.compile;

Ember.TEMPLATES['components/auto-suggest'] = precompileTemplate(
  "<ul class='selections'>" +
  "{{#each destination}}" +
  "  <li class=\"selection\">" +
  "    <a class=\"as-close\" {{action removeSelection this}}>x</a>" +
  "    {{display}}" +
  "  <\/li>" +
  "{{/each}}" +
  "<li>{{input type='text' value=query class='autosuggest'}}<\/li>" +
  "<\/ul>"+
  "<div {{bindAttr class=':results hasQuery::hdn'}}>" +
     "<ul class='suggestions'>" +
     "{{#each searchResults}}" +
     "  <li {{action addSelection this}} class=\"result\">{{display}}<\/li>" +
     "{{else}}" +
     " <li class='no-results'>No Results.<\/li>" +
     "{{/each}}" +
     "<\/ul>" +
  "<\/div>"
);
