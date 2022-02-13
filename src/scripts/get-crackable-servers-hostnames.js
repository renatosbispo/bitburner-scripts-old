import ScpExecAdapter from '../lib/scp-exec-adapter';
import PortOpenersManager from '../lib/port-openers-manager';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [responsePortNumber, ...serversHostnames] = ns.args;
  const { adapt } = new ScpExecAdapter(ns, responsePortNumber);
  const { getAvailablePortOpeners } = new PortOpenersManager(ns);

  await adapt(async () => {
    const availablePortOpeners = getAvailablePortOpeners();

    const crackableServersHostnames = serversHostnames.filter(
      (serverHostname) => {
        const numPortsRequired = ns.getServerNumPortsRequired(serverHostname);

        return availablePortOpeners.length >= numPortsRequired;
      }
    );

    return crackableServersHostnames;
  });
}
