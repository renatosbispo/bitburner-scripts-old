import ScpExecAdapter from '../lib/scp-exec-adapter';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [responsePortNumber, ...serversHostnames] = ns.args;
  const { adapt } = new ScpExecAdapter(ns, responsePortNumber);

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
