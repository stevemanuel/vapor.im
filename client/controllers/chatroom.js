Template.chatroom.helpers({
  status: function() {
    Chatrooms.findOne({
      permalink: Session.get('currentChatroomId')
    }, function(error, data) {
      if (!error) {
        if (data.people.length < 2) {
          return "alone!"
        }
      }
    });
  
  }
});

Template.chatroom.events({

});