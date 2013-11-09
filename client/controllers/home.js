Template.home.events({
  'click button': function() {

    var permalink = Random.id();
    var chatroomId = Chatrooms.insert({people: [], permalink: permalink});

    var personId = Random.id();
    Session.set('currentPersonId', personId);
    var person = {id: personId, message: ""};

    Chatrooms.update(chatroomId, { $push: { people: person }});

    Session.set('currentChatroomId', permalink);

    Meteor.Router.to("/room/" + permalink);
  }
});