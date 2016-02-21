var Firebase = require('firebase');
var project = require('./project');

module.exports = function() {
  // Members

  var db = new Firebase('https://projectboard.firebaseio.com/');
  db.onAuth(function(authData) {
    if (authData !== null) {
      var usersRef = new Firebase('https://projectboard.firebaseio.com/users/');
      usersRef.child(authData.uid).once('value', function(snapshot) {
        var isNewUser = snapshot.val() === null;

        if(isNewUser) {
          usersRef.child(authData.uid).set({
            provider: authData.provider,
            name: getUsername(authData)
          });

          var userRef = usersRef.child(authData.uid);
          userRef.child('columns').set({
            'New': {
              columnDisplayName: 'New',
              columnStyle: 'default',
              columnOrder: 0
            },
            'In-Progress': {
              columnDisplayName: 'In Progress',
              columnStyle: 'primary',
              columnOrder: 1
            },
            'Pending': {
              columnDisplayName: 'Pending',
              columnStyle: 'warning',
              columnOrder: 2
            },
            'Done': {
              columnDisplayName: 'Done',
              columnStyle: 'danger',
              columnOrder: 3
            }
          });
        }
      });
    }
  });

  // end Members

  // Private Methods

  var getUsername = function(authData) {
    var userName = '';

    if(authData.twitter) {
      userName = authData.twitter.username;
    } else if (authData.github) {
      userName = authData.github.username;
    } else {
      throw Error('Only Github or Twitter auth allowed!');
    }

    return userName;
  }

  // end Private Methods

  // Methods

  this.getAuth = function() {
    return db.getAuth();
  };

  this.doLogin = function(provider) {
    return $.Deferred(function(dfd) {
      db.authWithOAuthPopup(provider, function(err, user) {
        if (err) {
          dfd.reject(err);
        }

        if (user) {
          dfd.resolve(user);
        }
      });
    });
  };

  this.doLogout = function() {
    db.unauth();
  }

  // end Methods

  return this;
};
