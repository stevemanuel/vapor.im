Session.setDefault("vaporsReady", false);

Deps.autorun(function() {
  if (Session.get('currentChatroomId')) {
    Meteor.subscribe('chatrooms', Session.get('currentChatroomId'));
  }

  Meteor.subscribe('vapors', Session.get('currentChatroomId'), function() {
    Session.set("vaporsReady", true);
  });
});