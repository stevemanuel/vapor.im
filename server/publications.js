Meteor.publish('chatrooms', function(currentChatroomId) {
  return Chatrooms.find({permalink: currentChatroomId});
});