Template.home.events({
  'click button': function() {

    var permalink = Random.id();
    if($('#room-name').val() !== "Room Name") {
      var roomName = $('#room-name').val();
      } else {
        var roomName = permalink;
    };
    var chatroomId = Chatrooms.insert({people: [], permalink: permalink, roomName: roomName});

    var personId = Random.id();
    Session.set('currentPersonId', personId);
    var person = {id: personId, message: ""};

    //Chatrooms.update(chatroomId, { $push: { people: person }});

    Meteor.Router.to("/room/" + permalink);
  },
  'click #room-name': function() {
    $('#room-name').val("")
  }
});