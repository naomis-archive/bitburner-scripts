/**
 * Scans the server tree.
 *
 * @param {NS} ns The Netscript module.
 * @returns {string[]} The names of all available servers.
 */
export function scan(ns) {
  const servers = ["home"];
  for (let i = 0; i < servers.length; i++) {
    const subServers = ns
      .scan(servers[i])
      .filter((server) => !servers.includes(server));
    subServers.forEach((server) => servers.push(server));
  }
  return servers;
}
