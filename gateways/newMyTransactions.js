const conf = require("../conf");
const { 
  handleAddressesAuthoredByBridges,
  handleAddressesAuthoredByExchanges,
  getUnitAuthors
} = require('../services/newMyTransactionsService');

const newMyTransactions = async (arrNewUnits) => {
  for (let i = 0; i < arrNewUnits.length; i++) {
    const unitAuthorsRows = await getUnitAuthors(arrNewUnits[i]);

    for (let j = 0; j < unitAuthorsRows.length; j++) {
      if (conf.exchanges.includes(unitAuthorsRows[j].address)) {
        await handleAddressesAuthoredByExchanges(arrNewUnits[i], unitAuthorsRows[j].address);
      }

      if (conf.importBridgesAddresses.includes(unitAuthorsRows[j].address)) {
        await handleAddressesAuthoredByBridges(arrNewUnits[i], unitAuthorsRows[j].address);
      }
    }
  }
}

exports.newMyTransactions = newMyTransactions;
