import { restartHack } from "/modules/restart-hack.js";
import { startHack } from "/modules/start-hack.js";
import { validateRequirements } from "/modules/validate-requirements.js";
/**
 * @param {NS} ns The Netscript module.
 */
export async function main(ns) {
  const hostName = ns.args[0];
  if (!hostName) {
    ns.tprint("You must provide a hostname.");
    return;
  }
  const validHost = ns.serverExists(hostName);
  if (!validHost) {
    ns.tprint(`The ${hostName} server does not exist.`);
    return;
  }

  ns.tprint(`Starting hack on ${hostName}...`);

  const existingHack = ns.ps(hostName).find((el) => el.filename === "hack.js");

  if (existingHack) {
    await restartHack(ns, existingHack, hostName);
    return;
  }

  const isValid = validateRequirements(ns, hostName);

  if (!isValid) {
    return;
  }

  await startHack(ns, hostName);
}
