/** @param {import("..").NS } ns */

export default class ExecAsync {
  constructor(ns, portNumber) {
    this.ns = ns;
    this.portNumber = portNumber;

    this.execAsync = this.execAsync.bind(this);
  }

  async execAsync(...execArgs) {
    const pid = this.ns.exec(...execArgs);

    if (!pid) {
      const error = this.ns.getScriptLogs().pop();

      return { error };
    }

    const port = this.ns.getPortHandle(this.portNumber);

    while (port.empty()) {
      await this.ns.sleep(1000);
    }

    const response = port.read();
    let data;

    try {
      data = JSON.parse(response);
    } catch (_) {
      data = response;
    }

    return { data };
  }
}
