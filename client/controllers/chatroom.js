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
  },

  senderMessage: function() {
    
  }
});

Template.chatroom.events({
  'keydown input': function() {

  }
});

Template.chatroom.rendered = function() {

  var chat = $("#chat"),
      messages = $("#messages"),
      sender = $("#sender"),
      receiver = $('<div id="receiver"><span class="cursor">|&nbsp;</span>participant\'s message...</div>'),
      status = $("#status"),
      cursorHTML = $("<span>").addClass("cursor").html("|&nbsp;");

  function blinkCursor() {
    var cursor = $(".cursor");
    cursor.toggleClass('blink');
  }

  setInterval(blinkCursor, 500);
}