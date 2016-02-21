var app = require('./projectBoard');

var projectboard = new app();
var auth = projectboard.getAuth();

var vue = new Vue({
  el: '#app',
  data: {
    user: (function() {
      var user = null;
      if(auth) {
        user = auth[auth.provider];
      }
      return user;
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
