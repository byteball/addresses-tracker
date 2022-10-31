const db = require('ocore/db');

const runMigration = async () => {
  await db.query(`CREATE TABLE IF NOT EXISTS tracked_addresses (
		address CHAR(32) NOT NULL,
		creation_date DATETIME NOT NULL,
		PRIMARY KEY (address))`)
  
  await db.query(`CREATE INDEX IF NOT EXISTS trackedAddressesByCreationDate ON tracked_addresses (creation_date DESC)`);

  await db.query(`CREATE TABLE IF NOT EXISTS address_types (
		address CHAR(32) NOT NULL,
		is_aa TINYINT NOT NULL,
		PRIMARY KEY (address))`)

  console.log('migrations successfully executed')
}

exports.runMigration = runMigration;
