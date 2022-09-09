const db = require("ocore/db");
const conf = require('../conf.js');
const { checkIsAddressAA } = require("../helpers/checkIsAddressAA");

const getUnitsAuthoredBySubscribedAddresses = async (arrNewUnits) => {
  const rows = await db.query('SELECT unit FROM unit_authors WHERE unit IN (?) AND address IN (?) GROUP BY unit', [arrNewUnits, conf.subscriptions]);

  if (!rows.length) {
    return null;
  }
  
  return rows.map(row => row.unit);
}

const getDistinctOutputAddresses = async (units) => {
  const rows = await db.query('SELECT DISTINCT address FROM outputs WHERE unit IN (?) GROUP BY unit, address', [units]);

  return rows.map(row => row.address);
}

const insertSuitableAddressesToTracked = async (addresses) => {
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];

    if(conf.subscriptions.includes(address)) {
      continue;
    }

    const isAddressAA = await checkIsAddressAA(address);

    if(isAddressAA) {
      continue;
    }

    const trackedAddressRow = await db.query('SELECT address FROM tracked_addresses WHERE address = ?', [address]);

    if(trackedAddressRow.length) {
      continue;
    }

    await db.query('INSERT INTO (tracked_addresses, creation_date) VALUES (?, ?)', [address, Date.now()]);
  }
}

exports.getUnitsAuthoredBySubscribedAddresses = getUnitsAuthoredBySubscribedAddresses;
exports.getDistinctOutputAddresses = getDistinctOutputAddresses;
exports.insertSuitableAddressesToTracked = insertSuitableAddressesToTracked;