const db = require("ocore/db");
const network = require("ocore/network");

const isAa = async (address) => {
  const rows = await db.query('SELECT * FROM tracked_aas WHERE address = ?', [address]);

  if(rows.length) {
    return true
  }

  try {
    const definition = await network.requestFromLightVendor('light/get_definition', address);
    if(definition && definition[0] === 'autonomous agent') {
      await db.query('INSERT INTO tracked_aas(address) VALUES (?)', [address]);

      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

exports.isAa = isAa;
