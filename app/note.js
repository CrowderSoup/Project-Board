var $ = require('jquery')

module.exports = function(body, date) {
  if($.trim(body) !== '') {
    throw new Error('body cannot be null or empty');
  }

  this.body = body;
  this.date = date || new Date();

  return this;
}
