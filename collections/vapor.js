Vapors = new Meteor.Collection('vapors');

Vapors.allow({
  insert: function() {return true;},
  update: function() {return true;}
});