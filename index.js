const network = require('ocore/network.js');
const eventBus = require('ocore/event_bus.js');
const lightWallet = require('ocore/light_wallet.js');
const wallet_general = require('ocore/wallet_general.js');

const conf = require('./conf.js');

const { getImportToObyteBridgesAddresses } = require('./helpers/getImportToObyteBridgesAddresses.js');
const { cleanMyWatchedAddresses } = require('./helpers/cleanMyWatchedAddresses.js');
const { newMyTransactions } = require('./gateways/newMyTransactions.js');
const { launchServer } = require('./server.js');

lightWallet.setLightVendorHost(conf.hub);

eventBus.once('connected', (ws) => {
  network.initWitnessesIfNecessary(ws, startWatching);
});

async function addWatchedAas(subscriptions) {
  subscriptions.map((address) => wallet_general.addWatchedAddress(address, null, console.log));
}

async function startWatching() {
  await cleanMyWatchedAddresses();
  
  const importBridgesAddresses = await getImportToObyteBridgesAddresses();
  conf.subscriptions = [...conf.subscriptions, ...importBridgesAddresses];
  addWatchedAas(conf.subscriptions);

  eventBus.on('connected', () => {
    addWatchedAas(conf.subscriptions)
    lightWallet.refreshLightClientHistory();
  });

  lightWallet.refreshLightClientHistory();
}

launchServer();

eventBus.on('new_my_transactions', newMyTransactions);
