var Firebase = require('firebase');
var project = require('./project');

var app = function() {
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
            name: getName(authData)
          });
        }
      });
    }
  });

  function getName(authData) {
    switch (authData.provider) {
      case 'password':
        return authData.password.email.replace(/@.*/, '');
      case 'twitter':
        return authData.twitter.displayName;
      case 'facebook':
        return authData.facebook.displayName;
    }
  }

  // end Members

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


var projectboard = new app();
var auth = projectboard.getAuth();

var vue = new Vue({
  el: '#app',
  data: {
    user: (function() {
      return auth || null;
    })(),
    isLoggedIn: (function() {
      return (auth) ? true : false;
    })()
  },
  methods: {
    login: function(event) {
      var provider = $(event.target).data('provider');

      projectboard.doLogin(provider)
        .then(function(user) {
          console.log(user);
          this.user = user;
          this.isLoggedIn = true;
        }.bind(this))
        .fail(function(err) {
          console.log(err);
        }.bind(this));
    },
    logout: function(event) {
      this.user = null;
      this.isLoggedIn = false;

      projectboard.doLogout();
    }
  }
});
