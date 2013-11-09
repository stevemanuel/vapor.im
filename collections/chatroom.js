Chatrooms = new Meteor.Collection('chatrooms');

Chatrooms.allow({
  insert: function() {return true;},
  update: function() {return true;}
});