import { restartHack } from "/modules/restart-hack.js";
import { scan } from "/modules/scan.js";
import { shouldHack } from "/modules/should-hack.js";
import { startHack } from "/modules/start-hack.js";
import { validateRequirements } from "/modules/validate-requirements.js";
/**
 * Scans the internet for all available servers, then checks for ones to hack
 * and prompts to hack them.
 *
 * @param {NS} ns The Netscript module.
 */
export async function main(ns) {
  ns.tprint("Collecting server names.");
  const serverNames = scan(ns, ["home"]);

  for (const server of serverNames) {
    ns.tprint(`Checking ${server}...`);
    const canHack = validateRequirements(ns, server);
    if (!canHack) {
      continue;
    }
    const worthHacking = shouldHack(ns, server);
    if (!worthHacking) {
      continue;
    }
    const currentHack = ns.ps(server).find((el) => el.filename === "hack.js");
    if (currentHack) {
      const wantToRestart = await ns.prompt(
        `Server ${server} is already being hacked. Restart the process?`
      );
      if (wantToRestart) {
        await restartHack(ns, currentHack, server);
      }
      continue;
    }
    const wantToStart = await ns.prompt(
      `Server ${server} is not being hacked. Start hacking?`
    );
    if (wantToStart) {
      await startHack(ns, server);
    }
    continue;
  }
}
