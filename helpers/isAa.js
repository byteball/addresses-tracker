const db = require("ocore/db");
const network = require("ocore/network");

const isAa = async (address) => {
  const trackedAasRows = await db.query('SELECT is_aa FROM address_types WHERE address = ?', [address]);

  if(trackedAasRows.length) {
    return trackedAasRows[0].is_aa;
  }

  try {
    const definition = await network.requestFromLightVendor('light/get_definition', address);

    let isAa = 0;

    if(definition && definition[0] === 'autonomous agent') {
      isAa = 1;
    }

    await db.query('INSERT INTO address_types(address, is_aa) VALUES (?, ?)', [address, isAa]);

    return isAa;
  } catch (e) {
    return 0;
  }
}

exports.isAa = isAa;
