export default class ExecAsync {
  /** @param {import("..").NS } ns */
  constructor(ns, portNumber) {
    this.ns = ns;
    this.portNumber = portNumber;
  }

  execAsync = async (...execArgs) => {
    const [scriptToExecute, destination] = execArgs;

    const successfullyCopied = await this.ns.scp(scriptToExecute, destination);

    if (!successfullyCopied) {
      const errorMessage = ns.getScriptLogs().pop();
      const error = new Error(errorMessage);

      return { error };
    }

    const pid = this.ns.exec(...execArgs);

    if (!pid) {
      const errorMessage = this.ns.getScriptLogs().pop();
      const error = new Error(errorMessage);

      return { error };
    }

    const port = this.ns.getPortHandle(this.portNumber);

    while (port.empty()) {
      await this.ns.sleep(1);
    }

    const response = port.read();

    try {
      const parsedResponse = JSON.parse(response);

      if (!isObject(parsedResponse)) {
        const error = new Error('Script response is not an object.');

        return { error };
      }

      if ('data' in parsedResponse) {
        return { data: parsedResponse.data };
      }

      if ('error' in parsedResponse) {
        return { error: parsedResponse.error };
      }

      const error = new Error(
        'No data and no error property in script response.'
      );

      return { error };
    } catch (_) {
      const error = new Error('Script response is not valid JSON.');

      return { error };
    }
  };
}

function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
