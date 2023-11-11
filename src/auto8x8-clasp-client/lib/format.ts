function format(stringValue: string, formatObjs: Record<string, any>): string {
  return Object.keys(formatObjs).reduce(
    (acc, key) => acc.replace(
      new RegExp(`\\$\\{${key}\\}`, 'g'),
      formatObjs[key].toString(),
    ),
    stringValue,
  );
}