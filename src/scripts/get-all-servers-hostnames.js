import ExecAsyncAdapter from '../lib/exec-async-adapter';

/** @param {import("..").NS } ns */
export async function main(ns) {
  const [portNumber] = ns.args;
  const { adapt } = new ExecAsyncAdapter(ns, portNumber);

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
