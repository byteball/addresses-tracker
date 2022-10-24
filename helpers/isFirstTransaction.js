const myWitnesses = require("ocore/my_witnesses");
const network = require("ocore/network");

const isFirstTransaction = (address, unit) => {
  return new Promise((resolve) => {
      myWitnesses.readMyWitnesses(async (witnesses) => {
        const history = await network.requestFromLightVendor('light/get_history', {
          addresses: [address],
          witnesses
        });

        if (history.joints && history.joints[0].unit.unit === unit) {
          resolve(true);
          return;
        }

        resolve(false);
      }, 'wait')
    }
  )
}

exports.isFirstTransaction = isFirstTransaction;
