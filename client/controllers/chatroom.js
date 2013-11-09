Template.chatroom.helpers({
  status: function() {

    var chatroom = Chatrooms.findOne({
      permalink: Session.get('currentChatroomId')

    }, function(error, data) {
    });

    if(chatroom.people.length < 2) {
      return "ALONE";
    } else {
      return "HAZ FRiends!";
    }
  }
});

Template.chatroom.events({

});