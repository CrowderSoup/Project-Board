var Firebase = require('firebase');
var project = require('./project');
var user = require('./user');

module.exports = function () {
  var self = this;

  // Private Members

  var db = new Firebase('https://projectboard.firebaseio.com/');
  var userRef = null;

  // end Private Members

  // Public Memebers

  self.user = null;
  self.columns = null;

  // end Public Members

  // Private Methods

  var getUsername = function (authData) {
    var userName = '';

    if (authData.twitter) {
      userName = authData.twitter.username;
    } else if (authData.github) {
      userName = authData.github.username;
    } else {
      throw Error('Only Github or Twitter auth allowed!');
    }

    return userName;
  };

  var createUser = function (usersRef, user) {
    usersRef.child(self.user.uid).set({
      provider: self.user.provider,
      username: self.user.username
    });
  };

  var getUserRef = function (usersRef) {
    return usersRef.child(self.user.uid);
  }

  // end Private Methods

  // Methods

  self.getAuth = function () {
    return $.Deferred(function (dfd) {
      var auth = db.getAuth();
      if (auth !== null) {
        self.user = new user(auth.uid, auth.provider, getUsername(auth));

        // We're logged in so we need to load the columns
        $.when(self.getColumns())
          .then(function(){
            dfd.resolve(true);
          });
      } else {
        dfd.reject();
      }
    });

  };

  self.doLogin = function (provider) {
    return $.Deferred(function (dfd) {
      db.authWithOAuthPopup(provider, function (err, user) {
        if (err) {
          dfd.reject(err);
        }

        if (user) {
          dfd.resolve(user);
        }
      });
    });
  };

  self.doLogout = function () {
    db.unauth();
  };

  self.getColumns = function () {
    return $.Deferred(function (dfd) {
      if (userRef === null) {
        var usersRef = new Firebase('https://projectboard.firebaseio.com/users/');
        userRef = getUserRef(usersRef);
      }

      var columnsRef = userRef.child('columns');
      columnsRef.orderByChild('columnOrder').on('value', function (snapshot) {
        self.columns = snapshot.val();
        dfd.resolve(true);
      });
    });

  };

  // end Methods

  // Events

  db.onAuth(function (authData) {
    if (authData !== null) {
      self.user = new user(authData.uid, authData.provider, getUsername(authData));

      var usersRef = new Firebase('https://projectboard.firebaseio.com/users/');
      usersRef.child(self.user.uid).once('value', function (snapshot) {
        var isNewUser = snapshot.val() === null;

        if (isNewUser) {
          createUser(usersRef);

          userRef = getUserRef(usersRef);

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
        } else {
          userRef = getUserRef(usersRef);
        }

        // Get columns and projects
        self.getColumns();
      });
    }
  });

  // end Events

  return self;
};