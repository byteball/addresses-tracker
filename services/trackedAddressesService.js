const db = require("ocore/db");
const { DateTime } = require("luxon");

const { validateDate } = require("../helpers/validateDate.js");
const { fillMissingDates } = require("../helpers/fillMissingDates.js");

const getTrackedAddresses = async (fromDate, toDate) => {
  if(!validateDate(fromDate)) {
    throw 'Invalid from_date datetime format!';
  }

  if(toDate && !validateDate(toDate)) {
    throw 'Invalid to_date datetime format!';
  }

  if(!toDate) {
    toDate = DateTime.now().toFormat('yyyy-MM-dd HH:mm');
  }

  return db.query('SELECT address, creation_date FROM tracked_addresses WHERE creation_date >= ? AND creation_date <= ?', [fromDate, toDate]);
};

const getNewAddressesByDate = async (fromDate, toDate) => {
  if(!validateDate(fromDate)) {
    throw 'Invalid from_date datetime format!';
  }

  if(toDate && !validateDate(toDate)) {
    throw 'Invalid to_date datetime format!';
  }

  if(!toDate) {
    toDate = DateTime.now().toFormat('yyyy-MM-dd');
  }

  const rows = await db.query(`SELECT COUNT(*) as addresses, strftime('%Y-%m-%d', creation_date) as tracking_date
     FROM tracked_addresses WHERE tracking_date >= ? AND tracking_date <= ? GROUP BY tracking_date ORDER BY tracking_date`, 
    [fromDate, toDate]);

  const newAddressesByDay = {};
  rows.forEach(row => {
    newAddressesByDay[row.tracking_date] = row.addresses;
  });

  return fillMissingDates(fromDate, toDate, newAddressesByDay);
}


exports.getTrackedAddresses = getTrackedAddresses;
exports.getNewAddressesByDate = getNewAddressesByDate;
