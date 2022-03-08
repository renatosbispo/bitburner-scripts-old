export default class ScpExec {
  /** @param {import("..").NS } ns */
  constructor(ns, responsePortNumber) {
    this.ns = ns;
    this.responsePortNumber = responsePortNumber;
  }

  #scpExec = async (...execArgs) => {
    const [scriptToExecute, destination] = execArgs;
    const successfullyCopied = await this.ns.scp(scriptToExecute, destination);

    if (!successfullyCopied) {
      const errorMessage = this.ns.getScriptLogs().pop();
      const error = new Error(errorMessage);

      throw error;
    }

    const pid = this.ns.exec(...execArgs);

    if (!pid) {
      const errorMessage = this.ns.getScriptLogs().pop();
      const error = new Error(errorMessage);

      throw error;
    }
  };

  scpExec = async (...execArgs) => {
    await this.#scpExec(...execArgs);

    const [scriptToExecute, destination] = execArgs;
    const scriptAtDestination = `${scriptToExecute}@${destination}`;

    const port = this.ns.getPortHandle(this.responsePortNumber);

    while (port.empty()) {
      await this.ns.sleep(50);
    }

    const response = port.read();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(response);
    } catch (_) {
      const error = new Error(
        `Response from ${scriptAtDestination} is not valid JSON.`
      );

      throw error;
    }

    if (!isObject(parsedResponse)) {
      const error = new Error(
        `Response from ${scriptAtDestination} is not an object.`
      );

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
      `Response from ${scriptAtDestination} has no data and no error property.`
    );
  };

  scpExecVoid = async (...execArgs) => {
    await this.#scpExec(...execArgs);
  };
}

function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
