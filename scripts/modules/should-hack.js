/**
 * Checks if a server is worth hacking.
 *
 * @param {NS} ns The Netscript Module.
 * @param {string} hostName The server to target.
 * @returns {boolean} True if the server will produce money.
 */
export function shouldHack(ns, hostName) {
  const hasMoney = ns.getServerMaxMoney(hostName) > 0;
  if (!hasMoney) {
    ns.tprint(`Server ${hostName} cannot hold money.`);
    return false;
  }
  const hasRam =
    ns.getServerMaxRam(hostName) > ns.getScriptRam("hack.js", "home");
  if (!hasRam) {
    ns.tprint(`Server ${hostName} does not have enough RAM.`);
    return false;
  }
  return true;
}
