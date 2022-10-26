const network = require('ocore/network.js');
const eventBus = require('ocore/event_bus.js');
const lightWallet = require('ocore/light_wallet.js');
const wallet_general = require('ocore/wallet_general.js');

const conf = require('./conf.js');

const { runMigration } = require('./migration.js')
const { getImportToObyteBridgeAddresses } = require('./helpers/getImportToObyteBridgeAddresses.js');
const { newMyTransactions } = require('./gateways/newMyTransactions.js');
const { launchServer } = require('./server.js');

lightWallet.setLightVendorHost(conf.hub);

eventBus.once('connected', (ws) => {
  network.initWitnessesIfNecessary(ws, startWatching);
});

async function addWatchedAas(subscriptions) {
  subscriptions.map((address) => wallet_general.addWatchedAddress(address, null, console.log));
}

let importBridgeAddresses;

async function startWatching() {
  await runMigration();
  
  importBridgeAddresses = await getImportToObyteBridgeAddresses();
  
  const subscriptions = [...conf.exchanges, ...importBridgeAddresses];
  addWatchedAas(subscriptions);

  eventBus.on('connected', () => {
    addWatchedAas(subscriptions);
    lightWallet.refreshLightClientHistory();
  });

  lightWallet.refreshLightClientHistory();
}

launchServer();

eventBus.on('new_my_transactions', async (arrNewUnits) => {
  await newMyTransactions(arrNewUnits, importBridgeAddresses)
});
