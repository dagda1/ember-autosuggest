var precompileTemplate = Ember.Handlebars.compile;

Ember.TEMPLATES['components/auto-suggest'] = precompileTemplate(
  "<ul class='selections'>" +
  "{{#each destination}}" +
  "  <li class=\"selection\">{{display}}<\/li>" +
  "{{/each}}" +
  "<li>{{view view.autosuggest}}<\/li>" +
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
