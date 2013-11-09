Deps.autorun(function() {
  if (Session.get('currentChatroomId')) {
    Meteor.subscribe('chatrooms', Session.get('currentChatroomId'));
  }
});