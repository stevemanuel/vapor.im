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
    var chatRoom = Chatrooms.findOne({permalink: Session.get('currentChatroomId')});
    if(chatRoom === undefined) {
      return "";
    } else {
      document.title += " - "+chatRoom.roomName;
      return chatRoom.roomName;
    }
  },

  link: function() {
    return Session.get('currentChatroomId');
  },

  senderMessage: function() {
    return $("#chat").val();
  }
});

var createVapor = function(chatroomId) {
  var vapor = Vapors.insert({chatroom_id: chatroomId, message: "", last_heartbeat: new Date().getTime(), last_message: 0});
  console.log("created Vapor " + vapor);
  $.cookie(chatroomId, vapor);
};

Template.chatroom.rendered = function () {
  console.log("rendered called");
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
      console.log("created vapor for first user");
    } else if (currentVaporCount == 1) {
      createVapor(currentChatroomId);
      console.log("created vapor for second user");
    } else {
      alert("no new Vapor for you");
    }
  }

  $(".sender").one('click', function(e) { $("#chat").focus(); });
  $("#container").one('click', function(e) { $("#chat").focus(); });
  $("#chat").focus();

};

Template.chatroom.preserve([".sender"]);

Template.chatroom.events({
  // input in the event listens better on desktop for events in <input>
  'input, keypress #chat': function(e) {
    var currentChatroomId = Session.get('currentChatroomId');
    var newMessage = $(e.target).val();
    Vapors.update($.cookie(currentChatroomId), {$set: {message: newMessage}});
    console.log(Vapors.findOne($.cookie(currentChatroomId)).message);
    if (e.keyCode === 13 && newMessage !== "") {
      Vapors.update($.cookie(currentChatroomId), {$set: {message: "", last_message: new Date().getTime()}});

      $(e.target).val("");
      
      var message = $('.sender').clone();
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

    console.log("keypress sender");
    var cursorHTML = $("<span>").addClass("cursor").html("|&nbsp;");
    $(".sender").html($(e.target).val()).append(cursorHTML);
  }
});

Template.chatroom.currentVapors = function () {
  var chatroom_id = Session.get('currentChatroomId');
  return Vapors.find({chatroom_id: chatroom_id}, {sort: {last_message: 1}});
};

Template.chatroom.vaporIs = function (vaporMode) {
  var chatroom_id = Session.get('currentChatroomId');
  
  //console.log(this._id + " " + $.cookie(chatroom_id));
  
  if (this._id == $.cookie(chatroom_id))
    return "sender" == vaporMode;
  else
    return "receiver" == vaporMode;
};

Template.chatroom.created = function() {
  console.log("created called");

  var chat = $("#chat"),
      messages = $("#messages"),
      sender = $(".sender"),
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
      if(v.last_heartbeat < (now - 20000)) {
        console.log("going to remove " + v._id)
        Vapors.remove(v._id);
      }
    });
  }

  Meteor.setInterval(blinkCursor, 500);
  Meteor.setInterval(updateHeartbeat, 10000);

//   var cursorHTML = $("<span>").addClass("cursor").html("|&nbsp;");
//   $("#receiver span.cursor").remove();
//   $("#receiver").append(cursorHTML);

};

Template.chatroom.destroyed = function() {


};



