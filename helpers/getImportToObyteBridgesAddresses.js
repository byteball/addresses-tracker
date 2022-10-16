const axios = require("axios");
const conf = require("../conf.js");
const sleep = require("../utils/sleep");

async function getBridges(r = 0) {
  try {
    const bridges = await axios.get(`${conf.cs_url}/bridges`);

    return bridges.data.data;
  } catch (e) {
    if (r < 5 && e.response.status === 504) {
      await sleep(10);
      console.error('sleep: done');

      return getBridges(++r);
    }

    return [];
  }
}

async function getImportToObyteBridgesAddresses() {
  const bridges = await getBridges();

  const importToObyteBridgesAddresses = [];
  for (let i = 0; i < bridges.length; i++) {
    if(bridges[i].foreign_network === 'Obyte') {
      importToObyteBridgesAddresses.push(bridges[i].import_aa);
    }
  }

  return importToObyteBridgesAddresses;
}

exports.getImportToObyteBridgesAddresses = getImportToObyteBridgesAddresses;
