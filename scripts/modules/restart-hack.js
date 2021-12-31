import { calculateThreads } from "/modules/calculate-threads.js";
/**
 * Restarts the hack.js process.
 *
 * @param {NS} ns The Netscript module.
 * @param {ProcessInfo} process The process to terminate.
 * @param {string} hostName The server to target.
 */
export async function restartHack(ns, process, hostName) {
  ns.tprint("Existing hack detected. Restarting with new hack.");
  const oldId = process.pid;
  const isKilled = ns.kill(oldId, hostName);
  await ns.scp("hack.js", "home", hostName);
  const threads = calculateThreads();
  const newId = ns.exec("hack.js", hostName, threads, hostName);
  if (!newId) {
    ns.tprint("Failed to restart the hacking process...");
    return;
  }
  ns.tprint(
    `\nHacking began on ${hostName}:\nThreads: ${threads}\nProcess ID: ${newId}\nOld Process: ${oldId}\nTerminated?: ${isKilled}`
  );
  return;
}
