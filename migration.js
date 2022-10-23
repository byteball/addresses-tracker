const db = require('ocore/db');

async function start(){  
  await db.query(`CREATE TABLE IF NOT EXISTS tracked_addresses (
		address CHAR(32) NOT NULL,
		creation_date TEXT NOT NULL,
		PRIMARY KEY (address))`)

  await db.query(`CREATE TABLE IF NOT EXISTS tracked_aas (
		address CHAR(32) NOT NULL,
		PRIMARY KEY (address))`)

  console.log('done')
}

start();
