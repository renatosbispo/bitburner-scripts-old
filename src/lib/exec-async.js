/** @param {import("..").NS } ns */

export default async function execAsync(ns, portNumber, ...execArgs) {
  ns.exec(...execArgs);

  const port = ns.getPortHandle(portNumber);

  while (port.empty()) {
    await ns.sleep(1000);
  }

  const response = port.read();
  let data;

  try {
    data = JSON.parse(response);
  } catch (_) {
    data = response;
  }

  return data;
}
