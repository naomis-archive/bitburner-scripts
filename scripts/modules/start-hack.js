import { calculateThreads } from "/modules/calculate-threads.js";
/**
 * Starts a new hack process.
 *
 * @param {NS} ns The Netscript module.
 * @param {string} hostName The server to hack.
 */
export async function startHack(ns, hostName) {
  ns.tprint("Starting new hack.");
  await ns.scp("hack.js", "home", hostName);

  const threads = calculateThreads(ns, hostName);
  const pId = ns.exec("hack.js", hostName, threads, hostName);
  if (!pId) {
    ns.tprint("Failed to start the hacking process...");
    return;
  }
  ns.tprint(
    `Hacking began on ${hostName}:\nThreads: ${threads}\nProcess ID: ${pId}\nNo old process found.`
  );
}
