import ScpExecAdapter from '../lib/scp-exec-adapter';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [responsePortNumber] = ns.args;
  const { adapt } = new ScpExecAdapter(ns, responsePortNumber);

  await adapt(async () => {
    const serversHostnames = [];

    const getNeighborsHostnames = (
      thisServerHostname = 'home',
      parentServerHostname = null
    ) => {
      const neighborsHostnames = ns.scan(thisServerHostname);

      neighborsHostnames.forEach((neighborHostname) => {
        if (neighborHostname === parentServerHostname) {
          return;
        }

        serversHostnames.push(neighborHostname);
        getNeighborsHostnames(neighborHostname, thisServerHostname);
      });
    };

    getNeighborsHostnames();

    return serversHostnames;
  });
}
