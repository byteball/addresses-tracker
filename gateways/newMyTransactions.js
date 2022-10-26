const conf = require("../conf");
const { 
  handleAddressesAuthoredByBridges,
  handleAddressesAuthoredByExchanges,
  getUnitAuthors
} = require('../services/newMyTransactionsService');
const db = require("ocore/db");

const newMyTransactions = async (arrNewUnits, importBridgeAddresses) => {
  for (let i = 0; i < arrNewUnits.length; i++) {
    const unitAuthors = await getUnitAuthors(arrNewUnits[i]);
    
    for (let j = 0; j < unitAuthors.length; j++) {
      if (importBridgeAddresses.includes(unitAuthors[j])) {
        await handleAddressesAuthoredByBridges(arrNewUnits[i], unitAuthors);
        break;
      }
    }

    const outputsRows = await db.query('SELECT address FROM outputs WHERE unit = ?', [arrNewUnits[i]]);
    for (let k = 0; k < outputsRows.length; k++) {
      if (conf.exchanges.includes(outputsRows[k].address)) {
        await handleAddressesAuthoredByExchanges(outputsRows, outputsRows[k].address);
        break;
      }
    }
  }
}

exports.newMyTransactions = newMyTransactions;
