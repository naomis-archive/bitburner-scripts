/**
 * Script to hack the server.
 *
 * @param {NS} ns The Netscript module.
 */
export async function main(ns) {
  const hostName = ns.args[0];
  const scriptProcess = ns.ps(hostName).find((el) => el.filename === "hack.js");
  const threads = scriptProcess.threads;
  // run forever pog
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // weaken server
    while (
      ns.getServerSecurityLevel(hostName) >
      ns.getServerMinSecurityLevel(hostName) + 1
    ) {
      await ns.weaken(hostName, { threads });
    }
    // grow to 75% of max money
    while (
      ns.getServerMoneyAvailable(hostName) <
      ns.getServerMaxMoney(hostName) * 0.75
    ) {
      await ns.grow(hostName, { threads });
    }
    // then hack it
    await ns.hack(hostName, { threads });
  }
}
