const conf = require("../conf");
const { 
  handleAddressesAuthoredByBridges,
  handleAddressesAuthoredByExchanges,
  getUnitAuthors
} = require('../services/newMyTransactionsService');

const newMyTransactions = async (arrNewUnits, importBridgeAddresses) => {
  for (let i = 0; i < arrNewUnits.length; i++) {
    const unitAuthors = await getUnitAuthors(arrNewUnits[i]);
    
    for (let j = 0; j < unitAuthors.length; j++) {
      if (conf.exchanges.includes(unitAuthors[j])) {
        const exchangeAddress = unitAuthors[j];
        
        await handleAddressesAuthoredByExchanges(arrNewUnits[i], exchangeAddress);
      }

      if (importBridgeAddresses.includes(unitAuthors[j])) {
        await handleAddressesAuthoredByBridges(arrNewUnits[i], unitAuthors);
      }
    }
  }
}

exports.newMyTransactions = newMyTransactions;
