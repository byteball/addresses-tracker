exports.bServeAsHub = false;
exports.bLight = true;

exports.api_port = process.env.testnet ? 5555 : 5544;
exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';
exports.cs_url = process.env.testnet ? 'https://testnet-bridge.counterstake.org/api' : 'https://counterstake.org/api';

exports.bNoPassphrase = true;
exports.refreshHistoryOnlyAboveMci = 8043579;

exports.subscriptions = [
  'QR542JXX7VJ5UJOZDKHTJCXAYWOATID2'
]