exports.bServeAsHub = false;
exports.bLight = true;

exports.webPort = 3000;
exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';
exports.csUrl = process.env.testnet ? 'https://testnet-bridge.counterstake.org/api' : 'https://counterstake.org/api';

exports.bNoPassphrase = true;
exports.refreshHistoryOnlyAboveMci = 9087700;

exports.exchanges = [ 
  'QR542JXX7VJ5UJOZDKHTJCXAYWOATID2'
];

exports.subscriptions = [];
