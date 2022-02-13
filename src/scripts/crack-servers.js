import ScpExecAdapter from '../lib/scp-exec-adapter';
import PortOpenersManager from '../lib/port-openers-manager';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [responsePortNumber, ...serversHostnames] = ns.args;
  const { adapt } = new ScpExecAdapter(ns, responsePortNumber);
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
