/** @param {import("../..").NS } ns */

function getAllServers(ns) {
  const allServers = [];

  const findServers = (
    currentServerHostname = 'home',
    parentServerHostname = null
  ) => {
    const neighborsServersHostnames = ns.scan(currentServerHostname);

    for (let neighborServerHostname of neighborsServersHostnames) {
      if (neighborServerHostname === parentServerHostname) {
        continue;
      }

      const neighborServer = ns.getServer(neighborServerHostname);
      allServers.push(neighborServer);

      findServers(neighborServerHostname, currentServerHostname);
    }
  };

  findServers();

  return allServers;
}

function getAvailablePortOpeners(ns) {
  const portOpeners = [
    {
      filename: 'BruteSSH.exe',
      run: ns.brutessh,
    },
    {
      filename: 'FTPCrack.exe',
      run: ns.ftpcrack,
    },
    {
      filename: 'HTTPWorm.exe',
      run: ns.httpworm,
    },
    {
      filename: 'relaySMTP.exe',
      run: ns.relaysmtp,
    },
    {
      filename: ' SQLInject.exe',
      run: ns.sqlinject,
    },
  ];

  return portOpeners.filter(({ filename }) => ns.fileExists(filename, 'home'));
}

function getHackableServers(ns) {
  const isHackableServer = (server) => {
    const {
      hasAdminRights,
      numOpenPortsRequired,
      openPortCount,
      requiredHackingSkill,
    } = server;

    const playerHackingLevel = ns.getHackingLevel();
    const totalOpenPortsRequired = numOpenPortsRequired + openPortCount;
    const availablePortOpenersCount = getAvailablePortOpeners(ns).length;

    return (
      playerHackingLevel >= requiredHackingSkill &&
      (hasAdminRights || availablePortOpenersCount >= totalOpenPortsRequired)
    );
  };

  const hackableServers = getAllServers(ns).filter((server) =>
    isHackableServer(server)
  );

  return hackableServers;
}

export async function main(ns) {}
