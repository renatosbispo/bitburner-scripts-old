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

      throw error;
    }

    const pid = this.ns.exec(...execArgs);

    if (!pid) {
      const errorMessage = this.ns.getScriptLogs().pop();
      const error = new Error(errorMessage);

      throw error;
    }

    const port = this.ns.getPortHandle(this.portNumber);

    while (port.empty()) {
      await this.ns.sleep(1);
    }

    const response = port.read();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(response);
    } catch (_) {
      const error = new Error('Script response is not valid JSON.');

      throw error;
    }

    if (!isObject(parsedResponse)) {
      const error = new Error('Script response is not an object.');

      throw error;
    }

    if ('data' in parsedResponse) {
      return { data: parsedResponse.data };
    }

    if ('error' in parsedResponse) {
      const { error } = parsedResponse;

      if (error.simplified) {
        const { message, name, stack } = error;
        const rebuiltError = new Error();

        rebuiltError.message = message;
        rebuiltError.name = name;
        rebuiltError.stack = stack;

        throw rebuiltError;
      }

      throw error;
    }

    throw new Error(
      'No data and no error property in script response.'
    );
  };
}

function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
