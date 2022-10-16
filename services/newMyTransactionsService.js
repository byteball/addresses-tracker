const db = require("ocore/db");
const network = require("ocore/network");

const { checkIsAddressAA } = require("../helpers/checkIsAddressAA");

const getUnitAuthors = async (unit) => {
  return db.query('SELECT address FROM unit_authors WHERE unit = ?', [unit]);
}

const saveToTrackedAddresses = async (address) => {
  const trackedAddressRow = await db.query('SELECT address FROM tracked_addresses WHERE address = ?', [address]);

  if (trackedAddressRow.length) {
    return;
  }

  console.log(`Address - ${address} was tracked at ${(new Date()).toISOString()}`);
  await db.query('INSERT INTO tracked_addresses(address, creation_date) VALUES (?, ?)', [address, Date.now()]);
}

const handleAddressesAuthoredByExchanges = async (unit, authors) => {
  const outputsRows = await db.query('SELECT address FROM outputs WHERE unit = ?', [unit]);

  for (let i = 0; i < outputsRows.length; i++) {
    if (authors.includes(outputsRows[i].address) || await checkIsAddressAA(outputsRows[i].address)) {
      continue;
    }

    await saveToTrackedAddresses(outputsRows[i].address);
  }
}

const checkAddressesAndSaveSuitable = async (addressesRows) => {
  for (let i = 0; i < addressesRows.length; i++) {
    if (await checkIsAddressAA(addressesRows[i].address)) {
      continue;
    }

    await saveToTrackedAddresses(addressesRows[i].address);
  }
}

const getAndHandleAaResponseChain = async (unit) => {
  const definition = await network.requestFromLightVendor('light/get_aa_response_chain', {
    trigger_unit: unit
  });

  for (let i = 0; i < definition.length; i++) {
    if (definition[i].objResponseUnit) {
      const messages = definition[i].objResponseUnit.messages || [];
      for (let j = 0; j < messages.length; j++) {
        if (messages[j].app === 'payment') {
          const outputs = messages[j].payload.outputs;
          await checkAddressesAndSaveSuitable(outputs);
        }
      }

      const authors = definition[i].objResponseUnit.authors || [];
      await checkAddressesAndSaveSuitable(authors);
    }
  }
}

const handleAddressesAuthoredByBridges = async (unit, authors) => {
  const outputsRows = await db.query('SELECT address FROM outputs WHERE unit = ?', [unit]);

  for (let i = 0; i < outputsRows.length; i++) {
    if (authors.includes(outputsRows[i].address)) {
      continue;
    }

    if (await checkIsAddressAA(outputsRows[i].address)) {
      await getAndHandleAaResponseChain(unit);
    }

    await saveToTrackedAddresses(outputsRows[i].address);
  }
}

exports.getUnitAuthors = getUnitAuthors;
exports.handleAddressesAuthoredByExchanges = handleAddressesAuthoredByExchanges;
exports.handleAddressesAuthoredByBridges = handleAddressesAuthoredByBridges;
