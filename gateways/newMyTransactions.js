const { 
  getUnitsAuthoredBySubscribedAddresses, 
  getDistinctOutputAddresses, 
  insertSuitableAddressesToTracked 
} = require('../services/newMyTransactionsService');

const newMyTransactions = async (arrNewUnits) => {
  let units = await getUnitsAuthoredBySubscribedAddresses(arrNewUnits);
  console.log('!!!UNITS UNITS', units);
  if(!units) {
    return;
  }

  const outputAddresses = await getDistinctOutputAddresses(units);
  console.log('!!!outputAddresses outputAddresses', outputAddresses);
  await insertSuitableAddressesToTracked(outputAddresses);
}

exports.newMyTransactions = newMyTransactions; 