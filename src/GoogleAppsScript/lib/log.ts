function log(...msg: (string | object)[]): void {
  if (!Config.verbose) {
    return;
  }

  const value = msg[0];
  const isObject = typeof value === 'object';
  const isString = typeof value === 'string';
  const isEmptyObject = isObject && !(Object.keys(value).length);
  const isEmptyString = isString && msg.join("").trim() === "";

  if (isEmptyObject || isEmptyString) {
    return;
  }

  if (isObject) {
    console.info(msg.map(obj => JSON.stringify(obj, null, 2)).join("\n"));
    
  } else if (isString) {
    console.info(msg.join("").trim());
  }
}
