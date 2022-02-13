import ExecAsyncAdapter from '../lib/exec-async-adapter';
import PortOpenersManager from '../lib/port-openers-manager';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [portNumber, serializedServersHostnames] = ns.args;
  const { adapt } = new ExecAsyncAdapter(ns, portNumber);
  const { getAvailablePortOpeners } = new PortOpenersManager(ns);

  await adapt(async () => {
    const serversHostnames = JSON.parse(serializedServersHostnames);
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
