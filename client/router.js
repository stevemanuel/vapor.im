Meteor.Router.add({
  '/': 'home',
  '/room/:id' : function(id) {
    // access parameters in order a function args too
    Session.set('currentChatroomId', id);

    return 'chatroom';
  }
});

Meteor.Router.filters({
  'checkIsReturningUser': function() {

  }
});