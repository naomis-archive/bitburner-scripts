/**
 * @param {NS} ns The Netscript module.
 * @param {string} hostName The name of the server to hack.
 * @returns {boolean} True if the server is hackable.
 */
export function validateRequirements(ns, hostName) {
  ns.tprint("Validating requirements...");

  const hackRequirement = ns.getServerRequiredHackingLevel(hostName);
  const hackLevel = ns.getHackingLevel();

  if (hackLevel < hackRequirement) {
    ns.tprint(
      `Insufficient hacking level!\nYour Level: ${hackLevel}\nRequired: ${hackRequirement}`
    );
    return false;
  }
  ns.tprint("Hacking level sufficient!");

  if (ns.hasRootAccess(hostName)) {
    ns.tprint("Root access already detected!");
    return true;
  }

  const portProgrammes = [];
  const portNames = [];
  if (ns.fileExists("BruteSSH.exe")) {
    portProgrammes.push(ns.brutessh);
    portNames.push("SSH");
  }
  if (ns.fileExists("FTPCrack.exe")) {
    portProgrammes.push(ns.ftpcrack);
    portNames.push("FTP");
  }
  if (ns.fileExists("RelaySMTP.exe")) {
    portProgrammes.push(ns.relaysmtp);
    portNames.push("SMTP");
  }
  if (ns.fileExists("HTTPWorm.exe")) {
    portProgrammes.push(ns.httpworm);
    portNames.push("HTTP");
  }
  if (ns.fileExists("SQLInject.exe")) {
    portProgrammes.push(ns.sqlinject);
    portNames.push("SQL");
  }
  const requiredPorts = ns.getServerNumPortsRequired(hostName);

  if (portProgrammes.length < requiredPorts) {
    ns.tprint(
      `Insufficient Ports Open!\nYou can open: ${
        portProgrammes.length
      }\nRequired Open: ${requiredPorts}\nPort Hacks Detected: ${portNames.join(
        " "
      )}`
    );
    return;
  }

  ns.tprint(`Opening the following ports:\n ${portNames.join(" ")}`);

  for (const programme of portProgrammes) {
    programme(hostName);
  }

  ns.tprint("Granting root access!");
  ns.nuke(hostName);

  if (!ns.hasRootAccess(hostName)) {
    ns.tprint("Root access failed unexpectedly.");
    return false;
  }
  return true;
}
