const moment = require('moment')

module.exports = {
  ifCond: function(a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  momentFunc: function(datetime) {
    return moment(datetime).fromNow()
  }
}
