export default class PortOpenersManager {
  /** @param {import("..").NS } ns */
  constructor(ns) {
    this.ns = ns;

    this.programs = [
      {
        filename: 'BruteSSH.exe',
        nsMethod: ns.brutessh,
      },
      {
        filename: 'FTPCrack.exe',
        nsMethod: ns.ftpcrack,
      },
      {
        filename: 'HTTPWorm.exe',
        nsMethod: ns.httpworm,
      },
      {
        filename: 'relaySMTP.exe',
        nsMethod: ns.relaysmtp,
      },
      {
        filename: 'SQLInject.exe',
        nsMethod: ns.sqlinject,
      },
    ];
  }

  getAvailablePortOpeners = () => {
    return this.programs.filter(({ filename }) =>
      this.ns.fileExists(filename, 'home')
    );
  };
}
