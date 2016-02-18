var Firebase = require('firebase');
var project = require('./project');

var app = function() {
  // Members

  var db = new Firebase('https://projectboard.firebaseio.com/');
  console.log(db.getAuth());

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
