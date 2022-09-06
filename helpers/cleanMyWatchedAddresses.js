const db = require("ocore/db");

const cleanMyWatchedAddresses = async () => {
  await db.query(`DELETE FROM my_watched_addresses`);
}

exports.cleanMyWatchedAddresses = cleanMyWatchedAddresses;
