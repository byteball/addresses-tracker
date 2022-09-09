const { 
  getUnitsAuthoredBySubscribedAddresses, 
  getDistinctOutputAddresses, 
  insertSuitableAddressesToTracked 
} = require('../services/newMyTransactionsService');

const newMyTransactions = async (arrNewUnits) => {
  let units = await getUnitsAuthoredBySubscribedAddresses(arrNewUnits);

  if(!units) {
    return;
  }

  const outputAddresses = await getDistinctOutputAddresses(units);

  await insertSuitableAddressesToTracked(outputAddresses);
}

exports.newMyTransactions = newMyTransactions; 