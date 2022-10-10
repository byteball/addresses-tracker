const { 
  getUnitsAuthoredBySubscribedAddresses, 
  getDistinctOutputAddresses, 
  insertSuitableAddressesToTracked 
} = require('../services/newMyTransactionsService');
const { checkIsAddressAA } = require("../helpers/checkIsAddressAA");

const network = require("ocore/network");

const db = require("ocore/db");
const conf = require("../conf");

const newMyTransactions = async (arrNewUnits) => {
  for (let i = 0; i < arrNewUnits.length; i++) {
    const unitAuthorsRows = await db.query('SELECT address FROM unit_authors WHERE unit = ?', [arrNewUnits[i]]);

    const authors = unitAuthorsRows.map(row => row.address);

    for (let j = 0; j < authors.length; j++) {
      // 0.1) если биржа
      if (conf.exchanges.includes(authors[j])) {
        const outputsRows = await db.query('SELECT address FROM outputs WHERE unit = ?', [arrNewUnits[i]]);

        const outputs = outputsRows.map(row => row.address);

        for (let k = 0; k < outputs.length; k++) {
          if (authors.includes(outputs[k]) || await checkIsAddressAA(outputs[k])) {
            continue;
          }

          await saveToTrackedAddresses(outputs[k]);
        }
      }
      // 0.1)

      // 0.2) если мост
      if (conf.importBridgesAddresses.includes(authors[j])) {
        const outputsRows = await db.query('SELECT address FROM outputs WHERE unit = ?', [arrNewUnits[i]]);

        const outputs = outputsRows.map(row => row.address);

        for (let k = 0; k < outputs.length; k++) {
          if (authors.includes(outputs[k])) {
            continue;
          }

          if (await checkIsAddressAA(outputs[k])) {
            // 1) перебираем чейн
            const definition = await network.requestFromLightVendor('light/get_aa_response_chain', {
              trigger_unit: arrNewUnits[i]
            });

            for (let l = 0; l < definition.length; l++) {
              console.log('-------definition[l]---------', definition[l]);
              if (definition[l].objResponseUnit) {
                // 1.1) перебираем месседжи в чейне
                const messages = definition[l].objResponseUnit.messages || [];
                for (let m = 0; m < messages.length; m++) {
                  if (messages[m].app === 'payment') {
                    const outputs = messages[m].payload.outputs;

                    for (let n = 0; n < outputs.length; n++) {
                      if (await checkIsAddressAA(outputs[n].address)) {
                        continue;
                      }

                      await saveToTrackedAddresses(outputs[n].address);
                    }
                  }
                }
                // 1.1)

                // 1.2) перебираем авторов в чейне
                const authors = definition[l].objResponseUnit.authors || [];
                for (let n = 0; n < authors.length; n++) {
                  if (await checkIsAddressAA(authors[n].address)) {
                    continue;
                  }

                  await saveToTrackedAddresses(authors[n].address);
                }
                // 1.2)
              }
            }
            // 1)
          }

          await saveToTrackedAddresses(outputs[k]);
        }
      }
      // 0.2)
    }
  }
  
  
  
  // let units = await getUnitsAuthoredBySubscribedAddresses(arrNewUnits);
  //
  // if(!units) {
  //   return;
  // }
  //
  //
  // for (let i = 0; i < units.length; i++) {
  //   const outputAddresses = await getDistinctOutputAddresses(units[i]);
  //  
  //   if(outputAddresses) {
  //    
  //   }
  //
  //   const definition = await network.requestFromLightVendor('light/get_aa_response_chain', {
  //     trigger_unit: units[i]
  //   });
  //  
  //   console.log(definition);
  // }

   // await insertSuitableAddressesToTracked(outputAddresses);
}

const saveToTrackedAddresses = async (address) => {
  const trackedAddressRow = await db.query('SELECT address FROM tracked_addresses WHERE address = ?', [address]);

  if (trackedAddressRow.length) {
    console.log('======== Already tracked address');
    return;
  }
  
  console.log(`+++++++ Tracking - ${address}`);
  await db.query('INSERT INTO tracked_addresses(address, creation_date) VALUES (?, ?)', [address, Date.now()]);
}

exports.newMyTransactions = newMyTransactions; 