import ExecAsyncAdapter from '../lib/exec-async-adapter';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [portNumber, ...serversHostnames] = ns.args;
  const { adapt } = new ExecAsyncAdapter(ns, portNumber);

  await adapt(async () => {
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
