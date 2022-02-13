import ExecAsyncAdapter from '../lib/exec-async-adapter';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [portNumber, serializedServersHostnames] = ns.args;
  const { adapt } = new ExecAsyncAdapter(ns, portNumber);

  await adapt(async () => {
    const serversHostnames = JSON.parse(serializedServersHostnames);

    const hackableServersHostnames = serversHostnames.filter(
      (serverHostname) => {
        const serverRequiredHackingLevel =
          ns.getServerRequiredHackingLevel(serverHostname);

        return ns.getHackingLevel() >= serverRequiredHackingLevel;
      }
    );

    return hackableServersHostnames;
  });
}
