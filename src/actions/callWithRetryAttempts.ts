export async function callWithRetryAttempts(
  logMsg: string,
  callbackFn: (...callbackFnArgs: any[]) => Promise<any | undefined>,
  callbackFnArgs: any[] = [],
  maxRetries: number = 3,
  throwError: boolean = false,
  
): Promise<any | void>{
  
  let tryAttempt = 1;

  while (maxRetries >= tryAttempt) {
    try {
      
      if (logMsg) console.log(`(${tryAttempt}/${maxRetries}) ${logMsg}`);
      const returnValue = await callbackFn(...callbackFnArgs);
      console.log(`🟢 Successfully completed operation.`);
      return returnValue;
      
    } catch (e) {
      
      console.error(`🟡 The tryAttempt resulted in failure: ${e}`);
      if (maxRetries > tryAttempt) {
        console.info(`Retrying... (${maxRetries - tryAttempt} more tryAttempts remaining)`);
      } else {
        if (throwError) throw new Error(
          `🔴 Operation failed after ${maxRetries} tryAttempts: ${e}`
        );
      }
      tryAttempt++;
    }
  }
}
