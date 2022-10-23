const { DateTime } = require("luxon");

const HOURS_TIME_FORMAT = 'yyyy-MM-dd HH:mm';
const DATE_TIME_FORMAT = 'yyyy-MM-dd';

const validateDate = (date) => {
  if (!DateTime.fromFormat(date, HOURS_TIME_FORMAT).isValid && !DateTime.fromFormat(date, DATE_TIME_FORMAT).isValid) {
    return false
  }

  return true
}

exports.validateDate = validateDate;