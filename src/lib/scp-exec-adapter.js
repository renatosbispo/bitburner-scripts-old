export default class ScpExecAdapter {
  /** @param {import("..").NS } ns */
  constructor(ns, responsePortNumber) {
    this.ns = ns;
    this.responsePortNumber = responsePortNumber;
  }

  adapt = async (script) => {
    try {
      const scriptResponse = await script();

      const serializedScriptResponse = JSON.stringify({
        data: scriptResponse === undefined ? null : scriptResponse,
      });

      await this.ns.writePort(
        this.responsePortNumber,
        serializedScriptResponse
      );
    } catch (error) {
      let serializedScriptResponse;

      if (error instanceof Error) {
        const { message, name, stack } = error;
        const simplifiedError = { message, name, stack, simplified: true };

        serializedScriptResponse = JSON.stringify({ error: simplifiedError });
      } else {
        serializedScriptResponse = JSON.stringify({ error });
      }

      await this.ns.writePort(
        this.responsePortNumber,
        serializedScriptResponse
      );
    }
  };
}
