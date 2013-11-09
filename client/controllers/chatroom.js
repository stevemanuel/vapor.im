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
  'input, keypress input': function(e) {
    if (e.keyCode === 13) {
      $(e.target).val("");
      var message = $('#sender').clone();
      $("#messages").css("position", "relative").append(message);
      message.css("position", "absolute").animate({
        'top': "-100px",
        'left': "0",
        'zoom': "200%",
        'opacity': "0"
      }, 500, function() {
        message.remove();
      });
    }
    var cursorHTML = $("<span>").addClass("cursor").html("|&nbsp;");
    $("#sender").html($(e.target).val()).append(cursorHTML);
  }
});

Template.chatroom.created = function() {

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