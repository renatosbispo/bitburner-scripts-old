export default class PortOpenersManager {
  /** @param {import("..").NS } ns */
  constructor(ns) {
    this.ns = ns;
    this.programs = [
      'BruteSSH.exe',
      'FTPCrack.exe',
      'HTTPWorm.exe',
      'relaySMTP.exe',
      'SQLInject.exe',
    ];
  }

  getAvailablePortOpeners = () => {
    return this.programs.filter((program) =>
      this.ns.fileExists(program, 'home')
    );
  };
}
