/** @param {NS} ns **/

export default class ExecAsyncAdapter {
  constructor(ns, portNumber) {
    this.ns = ns;
    this.portNumber = portNumber;
  }

  adapt = async (script) => {
    try {
      const scriptResponse = await script();
      const serializedScriptResponse = JSON.stringify({
        data: scriptResponse === undefined ? null : scriptResponse,
      });

      await this.ns.writePort(this.portNumber, serializedScriptResponse);
    } catch (error) {
      let serializedScriptResponse;

      if (error instanceof Error) {
        const { message, name, stack } = error;
        const simplifiedError = { message, name, stack };

        serializedScriptResponse = JSON.stringify({ error: simplifiedError });
      } else {
        serializedScriptResponse = JSON.stringify({ error });
      }

      await this.ns.writePort(this.portNumber, serializedScriptResponse);
    }
  };
}
