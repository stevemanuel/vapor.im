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
    
    if( Session.get("lastKnownMessage") && Session.get("lastKnownMessage").length > 0 && theirMessage == "") {
      var receiver = $('.receiver').clone();
      $("#messages").css("position", "relative").append(receiver);
      
      receiver.css("position", "relative").animate({
        'top': "-100px",
        'left': "0",
        'zoom': "200%",
        'opacity': "0"
      }, 500, function() {
        receiver.remove();
      });
    }
    Session.set("lastKnownMessage", theirMessage);
    
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

  host: function() {
    return window.location.host;
  },

  senderMessage: function() {
    return $("#chat").val();
  },

  vaporsReady: function() {
    return Session.equals("vaporsReady", true);
  },

  linkIsOpen: function() {
    return Session.equals("linkIsOpen", true);
  },

  settingsIsShown: function() {
    return Session.equals("settingsIsShown", true);
  }
});

var createVapor = function(chatroomId) {
  var vapor = Vapors.insert({chatroom_id: chatroomId, message: "", last_heartbeat: new Date().getTime(), last_message: 0});
  console.log("created Vapor " + vapor);
  $.cookie(chatroomId, vapor);
};

Template.chatroom.rendered = function () {
  if (Session.equals("vaporsReady", true)) {
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
    $("body").one('click', function(e) { $("#chat").focus(); });
    $("#chat").focus();
  }

};

Template.chatroom.preserve([".sender"]);

Template.chatroom.events({
  // input in the event listens better on desktop for events in <input>
  'input, keypress #chat': function(e) {
    var currentChatroomId = Session.get('currentChatroomId');
    var newMessage = $(e.target).val();
    var vaporId = $.cookie(currentChatroomId);

    if (typeof e.keyCode === "undefined") {
      //this is a paste, it might be a url
      var inputVal = $(e.target).val();
      if(inputVal.length > 0) {

        if (inputVal.match(/^(http|https)\:(\S+)\.(gif|jpg|jpeg|png)$$/i) != null) {
          console.log("going to inject image");
          var imageHTML = "<img style='max-width: 300px;' src='" + inputVal + "'/>"
          $(".sender").html(imageHTML);
          $(e.target).val(imageHTML);
          Vapors.update(vaporId, {$set: {message: imageHTML}});

          return;
        }
      }
    } else {
      Vapors.update(vaporId, {$set: {message: newMessage}});

      if (e.keyCode === 13 && newMessage !== "") {
        Vapors.update(vaporId, {$set: {message: "", last_message: new Date().getTime()}});

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

        return;
      }
    }
    
    //append cursor
    var cursorHTML = $("<span>").addClass("cursor").html("|&nbsp;");
    $(".sender").html($(e.target).val()).append(cursorHTML);
  },
  'click .closeLink': function() {
    Session.set("linkIsOpen", false);
  },
  'click .openLink': function() {
    Session.set("linkIsOpen", true);
  },

  'click #settings': function(e) {
    e.preventDefault();
    var shown = Session.get("settingsIsShown");
    Session.set("settingsIsShown", !shown);
  },

  'click .theme': function(e) {
    var theme = $(e.target).data("theme");
    if (Session.equals("masterTheme", theme)) {
      return;
    }
    else {
      Session.set("masterTheme", theme);
    }
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



