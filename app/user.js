var utils = new (require('./utils'));

module.exports = function(uid, provider, username) {

  utils.notNullOrEmpty(uid, 'uid');
  utils.notNullOrEmpty(provider, 'provider');
  utils.notNullOrEmpty(username, 'username');

  this.uid = uid;
  this.provider = provider;
  this.username = username;

  return this;
};
