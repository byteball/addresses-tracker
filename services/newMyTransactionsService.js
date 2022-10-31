const db = require("ocore/db");
const network = require("ocore/network");

const { isAa } = require("../helpers/isAa");
const { isFirstTransaction } = require("../helpers/isFirstTransaction");

const getUnitAuthors = async (unit) => {
  const rows = await db.query('SELECT address FROM unit_authors WHERE unit = ?', [unit]);
  
  return rows.map(row => row.address);
}

const saveToTrackedAddresses = async (address, unit) => {
  const trackedAddressRow = await db.query('SELECT address FROM tracked_addresses WHERE address = ?', [address]);

  if (trackedAddressRow.length) {
    return;
  }
  
  if(!(await isFirstTransaction(address, unit))) {
    return;
  }

  const unitCreationDateRows = await db.query('SELECT creation_date FROM units WHERE unit = ?', [unit]);

  console.log(`Address - ${address} was tracked at ${(new Date()).toISOString()}`);
  await db.query('INSERT INTO tracked_addresses(address, creation_date) VALUES (?, ?)', [address, unitCreationDateRows[0].creation_date]);
}

const handleAddressesAuthoredByExchanges = async (outputsRows, exchangeAddress, unit) => {
  for (const { address } of outputsRows) {
    if (await isAa(address) || address === exchangeAddress) {
      continue;
    }

    await saveToTrackedAddresses(address, unit);
  }
}

const checkAddressesAndSaveNotAaAddresses = async (addressesRows, unit) => {
  for (const { address } of addressesRows) {
    if (await isAa(address)) {      
      continue;
    }

    await saveToTrackedAddresses(address, unit);
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
          await checkAddressesAndSaveNotAaAddresses(outputs, unit);
        }
      }
    }
  }
}

const handleAddressesAuthoredByBridges = async (unit, authors) => {
  const outputsRows = await db.query('SELECT address FROM outputs WHERE unit = ?', [unit]);

  for (const { address } of outputsRows) {
    if (authors.includes(address)) {
      continue;
    }

    if (await isAa(address)) {
      await getAndHandleAaResponseChain(unit);
      continue;
    }

    await saveToTrackedAddresses(address, unit);
  }
}

exports.getUnitAuthors = getUnitAuthors;
exports.handleAddressesAuthoredByExchanges = handleAddressesAuthoredByExchanges;
exports.handleAddressesAuthoredByBridges = handleAddressesAuthoredByBridges;
