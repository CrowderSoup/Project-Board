var app = require('./projectBoard');

var vue = new Vue({
  el: '#app',
  data: {
    user: undefined,
    isLoggedIn: false,
    columns: []
  },
  methods: {
    login: function (event) {
      var provider = $(event.target).data('provider');

      projectboard.doLogin(provider)
        .then(function (user) {
          console.log(user);
          this.user = projectboard.user;
          this.isLoggedIn = true;
        }.bind(this))
        .fail(function (err) {
          console.log(err);
        }.bind(this));
    },
    logout: function (event) {
      this.user = null;
      this.isLoggedIn = false;

      projectboard.doLogout();
    }
  }
});

var projectboard = new app();

// Let's see if the user is already authenticated
$.when(projectboard.getAuth())
  .then(function () {
    if (projectboard.user) {
      vue.user = projectboard.user;
      vue.isLoggedIn = true;
      vue.columns = projectboard.columns;
    }
  })
  .fail(function () {
    // User isn't logged in...
  });