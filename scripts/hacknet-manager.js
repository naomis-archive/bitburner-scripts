const hacknetMaximums = {
  level: 200,
  ram: 64,
  cores: 16,
};

/**
 * Every 10 minutes, checks your Hacknet nodes for available upgrades. If they're all maxed out,
 * attempts to purchase a new one and set it to 10 levels.
 * Will not spend more than half of your money.
 *
 * @param {NS} ns The Netscript Module.
 */
export async function main(ns) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let budget = ns.getServerMoneyAvailable("home") / 2;

    const currentHacknets = ns.hacknet.numNodes();

    ns.print(`Checking upgrades on existing nodes.`);

    let maxedCount = 0;

    for (let i = 0; i < currentHacknets; i++) {
      while (
        ns.hacknet.getCoreUpgradeCost(i, 1) <= budget &&
        ns.hacknet.getNodeStats(i).cores < hacknetMaximums.cores
      ) {
        ns.print(`Purchasing a core on node ${i}`);
        budget -= ns.hacknet.getCoreUpgradeCost(i, 1);
        ns.hacknet.upgradeCore(i, 1);
      }
      while (
        ns.hacknet.getRamUpgradeCost(i, 1) <= budget &&
        ns.hacknet.getNodeStats(i).ram < hacknetMaximums.ram
      ) {
        ns.print(`Purchasing RAM on node ${i}`);
        budget -= ns.hacknet.getRamUpgradeCost(i, 1);
        ns.hacknet.upgradeRam(i, 1);
      }
      while (
        ns.hacknet.getLevelUpgradeCost(i, 10) <= budget &&
        ns.hacknet.getNodeStats(i).level < hacknetMaximums.level
      ) {
        ns.print(`Purchasing 10 levels on node ${i}`);
        budget -= ns.hacknet.getLevelUpgradeCost(i, 10);
        ns.hacknet.upgradeLevel(i, 10);
      }
      if (
        ns.hacknet.getNodeStats(i).level >= hacknetMaximums.level &&
        ns.hacknet.getNodeStats(i).ram >= hacknetMaximums.ram &&
        ns.hacknet.getNodeStats(i).cores >= hacknetMaximums.cores
      ) {
        ns.print(`Hacknet node ${i} is maxed out!`);
        maxedCount++;
        continue;
      }
      ns.print(`Cannot afford more upgrades to node ${i} at this time.`);
    }

    if (maxedCount === currentHacknets) {
      if (currentHacknets >= ns.hacknet.maxNumNodes()) {
        ns.print(`All nodes fully upgraded, and cannot purchase new nodes!`);
        break;
      } else if (ns.hacknet.getPurchaseNodeCost(1) >= budget) {
        ns.print(
          "All nodes fully upgraded. Cannot afford a new node at this time."
        );
      } else {
        ns.print(
          "All nodes are fully upgraded. Attempting to purchase new node."
        );
        const newNode = ns.hacknet.purchaseNode(1);
        ns.hacknet.upgradeLevel(newNode, 9);
      }
    }
    await ns.sleep(600000);
  }
}
