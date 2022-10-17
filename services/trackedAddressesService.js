const db = require("ocore/db");

const getTrackedAddresses = async (fromTimestamp, toTimestamp) => {
  if (!fromTimestamp || !toTimestamp) {
    const timestamp = Date.now();
    toTimestamp = timestamp;
    fromTimestamp = timestamp - (24 * 60 * 60 * 1000);
  }
  
  return db.query('SELECT address, creation_date FROM tracked_addresses WHERE creation_date >= ? AND creation_date <= ?', [fromTimestamp, toTimestamp]);
};

exports.getTrackedAddresses = getTrackedAddresses;
