Meteor.Router.add({
  '/': 'home',
  '/room/:id': 'chatroom',
})

Meteor.Router.filters({
  'checkIsReturningUser': function() {
    
  }
})