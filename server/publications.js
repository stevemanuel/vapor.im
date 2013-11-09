Meteor.publish('chatrooms', function(currentChatroomId) {
  return Chatrooms.find({permalink: currentChatroomId});
});

Meteor.publish('vapors', function(id) {
	return Vapors.find({chatroom_id: id});
});