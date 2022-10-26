const myWitnesses = require("ocore/my_witnesses");
const network = require("ocore/network");

const isFirstTransaction = (address, unit) => {
  return new Promise((resolve) => {
      myWitnesses.readMyWitnesses(async (witnesses) => {
        try {
          const history = await network.requestFromLightVendor('light/get_history', {
            addresses: [address],
            witnesses
          });

          if (history.joints && history.joints[history.joints.length - 1].unit.unit === unit) {
            resolve(true);
            return;
          }

          resolve(false);
        } catch (e) {
          if (e === "your history is too large, consider switching to a full client") {
            resolve(false);
          } else {
            throw e;
          }
        }
      }, 'wait')
    }
  )
}

exports.isFirstTransaction = isFirstTransaction;
