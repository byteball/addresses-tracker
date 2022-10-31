const db = require("ocore/db");

const { validateDate } = require("../helpers/validateDate");
const { DateTime } = require("luxon");

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

const getTrackedAddressesCountByDate = async (fromDate, toDate) => {
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
     FROM tracked_addresses WHERE creation_date >= ? AND creation_date <= ? GROUP BY tracking_date ORDER BY tracking_date`, 
    [fromDate, toDate]);

   
  const result = {};
  rows.forEach(row => {
    result[row.tracking_date] = row.addresses;
  });

  let dateBuffer = DateTime.fromFormat(fromDate, 'yyyy-MM-dd');
  toDate = DateTime.fromFormat(toDate, 'yyyy-MM-dd');
  do {
    const dateString = dateBuffer.toFormat('yyyy-MM-dd');

    if (result[dateString] !== undefined) {
      dateBuffer = dateBuffer.plus({ days: 1 });
      continue;
    }

    result[dateString] = 0;
    dateBuffer = dateBuffer.plus({ days: 1 });
  } while (dateBuffer.toUnixInteger() <= toDate.toUnixInteger())

  return result;
}


exports.getTrackedAddresses = getTrackedAddresses;
exports.getTrackedAddressesCountByDate = getTrackedAddressesCountByDate;
