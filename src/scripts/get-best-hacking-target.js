import ScpExecAdapter from '../lib/scp-exec-adapter';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [responsePortNumber, ...serversHostnames] = ns.args;
  const { adapt } = new ScpExecAdapter(ns, responsePortNumber);

  await adapt(async () => {
    const filterdServersHostnames = serversHostnames.filter(
      (serverHostname) => {
        return ns.getServerGrowth(serverHostname) < 100;
      }
    );

    const getServerHackingScore = (serverHostname) => {
      const serverGrowth = ns.getServerGrowth(serverHostname);
      const serverMaxMoney = ns.getServerMaxMoney(serverHostname);
      const serverMinSecurityLevel =
        ns.getServerMinSecurityLevel(serverHostname);

      return (serverGrowth * serverMaxMoney) / serverMinSecurityLevel;
    };

    const bestHackingTarget = filterdServersHostnames.reduce(
      (bestServerHostname, currentServerHostname) => {
        const bestServerHostnameScore =
          getServerHackingScore(bestServerHostname);

        const currentServerHostnameScore = getServerHackingScore(
          currentServerHostname
        );

        return currentServerHostnameScore > bestServerHostnameScore
          ? currentServerHostname
          : bestServerHostname;
      }
    );

    return bestHackingTarget;
  });
}
