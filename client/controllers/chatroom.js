Template.chatroom.rendered = function () {
  var self = this;

  var currentChatroomId = Session.get('currentChatroomId');
  var currentVapors = null;

  //if ( $.cookie(currentChatroomId) ) {
  if (document.cookie == "chatroom_id=" + currentChatroomId) {
    alert("you already joined this!");
  } else {
    currentVapors = Vapors.find({chatroom_id: currentChatroomId});
    var currentVaporCount = currentVapors.count();
    
    if (currentVaporCount == 0) {
      var vapor = Vapors.insert({chatroom_id: currentChatroomId, message: ""});
      document.cookie = "chatroom_id=" + currentChatroomId;
    } else if (currentVaporCount == 1) {
      var vapor = Vapors.insert({chatroom_id: currentChatroomId, message: ""});
    } else {
      alert("no new Vapor for you")
    }
  }



  //if this user currently has a a cookied userid for this session
    // do nothing
  // if not
      //if chatroom only has 0 people
        //create a vapor
      //else if chatroom has 1 people
        //create a new vapor
      //else
        //reject user for now

};

Template.chatroom.helpers({
  status: function() {

    var chatroom = Chatrooms.findOne({
      permalink: Session.get('currentChatroomId')

    }, function(error, data) {
    });

    if(typeof chatroom === "undefined") {
      return "LOADING...";
    } else {
      if(chatroom.people.length < 2) {
        return "ALONE";
      } else {
        return "HAZ FRiends!";
      }
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
