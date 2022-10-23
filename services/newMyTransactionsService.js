const db = require("ocore/db");
const network = require("ocore/network");

const { isAa } = require("../helpers/isAa");

const getUnitAuthors = async (unit) => {
  const rows = await db.query('SELECT address FROM unit_authors WHERE unit = ?', [unit]);
  
  return rows.map(row => row.address);
}

const saveIfNotExistsToTrackedAddresses = async (address) => {
  const trackedAddressRow = await db.query('SELECT address FROM tracked_addresses WHERE address = ?', [address]);

  if (trackedAddressRow.length) {
    return;
  }

  console.log(`Address - ${address} was tracked at ${(new Date()).toISOString()}`);
  await db.query('INSERT INTO tracked_addresses(address, creation_date) VALUES (?, DATETIME("now"))', [address]);
}

const handleAddressesAuthoredByExchanges = async (unit, exchangeAddress) => {
  const outputsRows = await db.query('SELECT address FROM outputs WHERE unit = ?', [unit]);
  
  if(outputsRows.find(row => row.address === exchangeAddress)) {
    for (let i = 0; i < outputsRows.length; i++) {
      if (await isAa(outputsRows[i].address) || outputsRows[i].address === exchangeAddress) {
        continue;
      }

      await saveIfNotExistsToTrackedAddresses(outputsRows[i].address);
    }
  }   
}

const checkAddressesAndSaveNotAaAddresses = async (addressesRows) => {
  for (let i = 0; i < addressesRows.length; i++) {
    if (await isAa(addressesRows[i].address)) {      
      continue;
    }

    await saveIfNotExistsToTrackedAddresses(addressesRows[i].address);
  }
}

const getAndHandleAaResponseChain = async (unit) => {
  const responseChain = await network.requestFromLightVendor('light/get_aa_response_chain', {
    trigger_unit: unit
  });

  for (let i = 0; i < responseChain.length; i++) {
    if (responseChain[i].objResponseUnit) {
      const messages = responseChain[i].objResponseUnit.messages || [];
      for (let j = 0; j < messages.length; j++) {
        if (messages[j].app === 'payment') {
          const outputs = messages[j].payload.outputs;
          await checkAddressesAndSaveNotAaAddresses(outputs);
        }
      }
    }
  }
}

const handleAddressesAuthoredByBridges = async (unit, authors) => {
  const outputsRows = await db.query('SELECT address FROM outputs WHERE unit = ?', [unit]);

  for (let i = 0; i < outputsRows.length; i++) {
    if (authors.includes(outputsRows[i].address)) {
      continue;
    }

    if (await isAa(outputsRows[i].address)) {
      await getAndHandleAaResponseChain(unit);
      continue;
    }

    await saveIfNotExistsToTrackedAddresses(outputsRows[i].address);
  }
}

exports.getUnitAuthors = getUnitAuthors;
exports.handleAddressesAuthoredByExchanges = handleAddressesAuthoredByExchanges;
exports.handleAddressesAuthoredByBridges = handleAddressesAuthoredByBridges;
