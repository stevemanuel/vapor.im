Session.setDefault("vaporsReady", false);
Session.setDefault("linkIsOpen", true);
Session.setDefault("settingsIsShown", false);
Session.setDefault("masterTheme", "default");

Deps.autorun(function() {
  if (Session.get('currentChatroomId')) {
    Meteor.subscribe('chatrooms', Session.get('currentChatroomId'));
  }

  Meteor.subscribe('vapors', Session.get('currentChatroomId'), function() {
    Session.set("vaporsReady", true);
  });

});