const db = require("ocore/db");
const { validateDate } = require("../helpers/validateDate");

const getTrackedAddresses = async (fromDate, toDate) => {
  if(!validateDate(fromDate)) {
    throw 'Invalid from_date datetime format!';
  }
  
  if(!validateDate(toDate)) {
    throw 'Invalid to_date datetime format!';
  }

  return db.query('SELECT address, creation_date FROM tracked_addresses WHERE creation_date >= ? AND creation_date <= ?', [fromDate, toDate]);
};

exports.getTrackedAddresses = getTrackedAddresses;
