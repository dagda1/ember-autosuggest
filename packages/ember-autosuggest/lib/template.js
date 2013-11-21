var precompileTemplate = Ember.Handlebars.compile;

Ember.TEMPLATES['components/auto-suggest'] = precompileTemplate(
  "<ul class='selections'>" +
  "{{#each destination}}" +
  "  <li class=\"selection\">" +
  "    <a class=\"as-close\" {{action removeSelection this}}>x</a>" +
  "    {{#if controller.template}}" +
  "      {{yield}}" +
  "    {{/if}}" +
  "    {{displayHelper controller.searchPath}}" +
  "  <\/li>" +
  "{{/each}}" +
  "<li>{{view view.autosuggest value=query moveSelection='moveSelection' selectActive='selectActive' hideResults='hideResults' class='autosuggest'}}<\/li>" +
  "<\/ul>"+
  "<div {{bindAttr class=':results hasQuery::hdn'}}>" +
     "<ul class='suggestions'>" +
     "{{#each displayResults}}" +
     "  <li {{action addSelection this}} {{bindAttr class=\":result active\"}}>" +
     "    <span class=\"result-name\">" +
     "    {{#if controller.template}}" +
     "      {{yield}}" +
     "    {{/if}}" +
     "    {{displayHelper controller.searchPath}}" +
     "    </span>" +
     "  <\/li>" +
     "{{else}}" +
     " <li class='no-results'>No Results.<\/li>" +
     "{{/each}}" +
     "<\/ul>" +
  "<\/div>"
);
