Template.chatroom.helpers({
  notAlone: function() {

    var currentVapors = Vapors.find({chatroom_id: Session.get('currentChatroomId')});
    var currentVaporCount = currentVapors.count();

    if(typeof currentVaporCount === 0) {
      return "LOADING...";
    } else {
      if(currentVaporCount < 2) {
        return false;
      } else {
        return true;
      }
    }
  },
  receiverMessage: function() {
    console.log('receiverMessage called');

    var senderId = $.cookie(Session.get("currentChatroomId"));
    var theirMessage = Vapors.find({_id: { $ne: senderId}}).fetch()[0].message;
    return theirMessage;
  },

  roomName: function() {
    return Session.get('roomName');
  },

  link: function() {
    return Session.get('currentChatroomId');
  }
});

var createVapor = function(chatroomId) {
  var vapor = Vapors.insert({chatroom_id: chatroomId, message: "", last_heartbeat: new Date().getTime()});
  $.cookie(chatroomId, vapor);
};

Template.chatroom.rendered = function () {
  var self = this;

  var currentChatroomId = Session.get('currentChatroomId');
  var currentVapors = null;

  currentVapors = Vapors.find({chatroom_id: currentChatroomId});
  var currentVaporCount = currentVapors.count();

  if ( $.cookie(currentChatroomId) ) {
    // there are other people in the room.
    var myVaporId =  $.cookie(currentChatroomId);
    var myVapor = Vapors.findOne(myVaporId);

    if (typeof myVapor === "undefined") {
      createVapor(currentChatroomId);
      console.log("created vapor for previous user");
    }
  } else {

    if (currentVaporCount == 0) {
      createVapor(currentChatroomId);
    } else if (currentVaporCount == 1) {
      createVapor(currentChatroomId);
    } else {
      alert("no new Vapor for you");
    }
  }

  var cursorHTML = $("<span>").addClass("cursor").html("|&nbsp;");
  $("#receiver span.cursor").remove();
  $("#receiver").append(cursorHTML);

  $("#sender").on('click', function(e) { $("#chat").focus() })
  $("#chat").focus()
};

Template.chatroom.events({
  'input, keypress input': function(e) {
    var currentChatroomId = Session.get('currentChatroomId');
    var newMessage = $(e.target).val();
    Vapors.update($.cookie(currentChatroomId), {$set: {message: newMessage}});
    console.log(Vapors.findOne($.cookie(currentChatroomId)).message);
    if (e.keyCode === 13) {
      Vapors.update($.cookie(currentChatroomId), {$set: {message: ""}});
      $(e.target).val("");
      var message = $('#sender').clone();
      $("#messages").css("position", "relative").append(message);
      message.css("position", "relative").animate({
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
      cursorHTML = $("<span>").addClass("cursor").html("|&nbsp;"),
      receiverId;

  function blinkCursor() {
    var cursor = $(".cursor");
    cursor.toggleClass('blink');
  }

  function updateHeartbeat() {
    var currentChatroomId = Session.get('currentChatroomId');
    var now = new Date().getTime();
    Vapors.update($.cookie(currentChatroomId), {$set: {last_heartbeat: now}});

    Vapors.find({chatroom_id: currentChatroomId}).forEach(function(v) {
      if(v.last_heartbeat < (now - 11000)) {
        console.log("going to remove " + v._id)
        Vapors.remove(v._id);
      }
    });
  }

  Meteor.setInterval(blinkCursor, 500);
  Meteor.setInterval(updateHeartbeat, 10000);
  
};

Template.chatroom.destroyed = function() {


};



