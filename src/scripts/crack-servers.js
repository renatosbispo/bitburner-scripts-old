import ExecAsyncAdapter from '../lib/exec-async-adapter';
import PortOpenersManager from '../lib/port-openers-manager';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [portNumber, ...serversHostnames] = ns.args;
  const { adapt } = new ExecAsyncAdapter(ns, portNumber);
  const { getAvailablePortOpeners } = new PortOpenersManager(ns);

  await adapt(async () => {
    const availablePortOpeners = getAvailablePortOpeners();

    serversHostnames.forEach((serverHostname) => {
      availablePortOpeners.forEach(({ nsMethod }) => {
        nsMethod(serverHostname);
      });

      ns.nuke(serverHostname);
    });
  });
}
