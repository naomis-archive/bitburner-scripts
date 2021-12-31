/**
 * Calculates the number of threads to use based on the server's available
 * memory.
 *
 * @param {NS} ns The Netscript Module.
 * @param {string} hostName The server to target.
 * @returns {number} The threads to generate.
 */
export function calculateThreads(ns, hostName) {
  const maxMem = ns.getServerMaxRam(hostName);
  const memUsage = ns.getScriptRam("hack.js", hostName);
  const threads = Math.floor(maxMem / memUsage);
  if (threads === Infinity) {
    ns.tprint("Error in calculating threads. Defaulting to 1.");
    return 1;
  }
  return threads;
}
