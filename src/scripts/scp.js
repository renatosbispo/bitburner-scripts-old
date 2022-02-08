/** @param {import("..").NS } ns */

import ExecAsyncAdapater from '/lib/exec-async-adapter.js';

export async function main(ns) {
  const [portNumber, ...scpArgs] = ns.args;
  const { adapt } = new ExecAsyncAdapater(ns, portNumber);

  await adapt(async () => {
    const successfullyCopied = await ns.scp(...scpArgs);

    if (!successfullyCopied) {
      const errorMessage = ns.getScriptLogs().pop();

      throw new Error(errorMessage);
    }
  });
}
