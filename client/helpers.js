Handlebars.registerHelper("masterTheme", function() {
  return Session.get("masterTheme");;
});

Handlebars.registerHelper("check", function(theme) {
  return Session.equals("masterTheme", theme);
});