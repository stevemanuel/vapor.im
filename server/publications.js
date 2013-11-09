Meteor.publish('chatrooms', function(currentChatroomId) {
  return Chatrooms.find({permalink: currentChatroomId});
});

Meteor.publish('vapors', function() {
	return Vapors.find();
});