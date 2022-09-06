exports.bServeAsHub = false;
exports.bLight = true;

exports.api_port = process.env.testnet ? 5555 : 5544;
exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';
exports.cs_url = process.env.testnet ? 'https://testnet-bridge.counterstake.org/api' : 'https://counterstake.org/api';

exports.bNoPassphrase = true;
exports.refreshHistoryOnlyAboveMci = 9509706; // 9141524

exports.subscriptions = [
  'QR542JXX7VJ5UJOZDKHTJCXAYWOATID2',
  'FOPUBEUPBC6YLIQDLKL6EW775BMV7YOH',
  'GFK3RDAPQLLNCMQEVGGD2KCPZTLSG3HN',
  'I2ADHGP4HL6J37NQAD73J7E5SKFIXJOT',
  'JMFXY26FN76GWJJG7N36UI2LNONOGZJV',
  'JPQKPRI5FMTQRJF4ZZMYZYDQVRD55OTC',
  'TKT4UESIKTTRALRRLWS4SENSTJX6ODCW',
  'UE25S4GRWZOLNXZKY4VWFHNJZWUSYCQC'
]