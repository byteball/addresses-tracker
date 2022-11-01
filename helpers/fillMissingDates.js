const { DateTime } = require("luxon");

const fillMissingDates = (fromDate, toDate, newAddressesByDay) => {
  const toDateTime = DateTime.fromFormat(toDate, 'yyyy-MM-dd');

  const result = [];

  let dateBuffer = DateTime.fromFormat(fromDate, 'yyyy-MM-dd');
  do {
    const dayStat = {};
    dayStat.tracking_date = dateBuffer.toFormat('yyyy-MM-dd');

    if (newAddressesByDay[dayStat.tracking_date] !== undefined) {
      dayStat.addresses = newAddressesByDay[dayStat.tracking_date];
      result.push(dayStat);
      dateBuffer = dateBuffer.plus({ days: 1 });
      continue;
    }

    dayStat.addresses = 0;
    result.push(dayStat);
    dateBuffer = dateBuffer.plus({ days: 1 });
  } while (dateBuffer.toUnixInteger() <= toDateTime.toUnixInteger())

  return result;
}

exports.fillMissingDates = fillMissingDates;