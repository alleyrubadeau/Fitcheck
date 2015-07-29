var Resource = require('./resource');
var Sleep = Resource.extend({
  timeInBed: function () {
    return this.getSummaryItem('totalTimeInBed');
  },

  minutesAsleep: function () {
    return this.getSummaryItem('totalMinutesAsleep');
  },

  hoursAndMinutesAsleep: function () {
    var mins = this.minutesAsleep();

    return {
        hours: Math.floor(mins / 60)
      , mins: mins % 60
    };
  }
});

module.exports = Sleep;
