
class UrlFetchAppParams {
  
  public data: Record<string, any>;

  constructor(initialData: Record<string, any> = {}) {
    this.data = initialData;
  }
  //////////////////////
  ////    Public    ////
  //////////////////////

  public get(): Record<string, any> {
    return this.data;
  }

  public setMethod(addValue: string): this {
    this.data = { ...this.data, "method": addValue };
    return this;
  }
  
  public setHeaders(addValue: Record<string, any>): this {
    this.data = { ...this.data, "headers": addValue };
    return this;
  }

  public setContentType(addValue: string): this {
    this.data = { ...this.data, "Content-Type": addValue };
    return this;
  }

  public setMuteHttpExceptions(addValue: boolean): this {
    this.data = { ...this.data, "muteHttpExceptions": addValue };
    return this;
  }

  public setAccept(addValue: string): this {
    this.data = {
      ...this.data, 
      "headers": { ...this.data.headers, "Accept": addValue } 
    };
    return this;
  }

  public setEventType(addValue: string): this {
    this.data = {
      ...this.data,
      payload: JSON.stringify(
        {
          ...UrlFetchAppParams.stringifiedParse(this.data.payload),
          event_type: addValue,
        },
      )
    };
    return this;
  }

  public setClientPayload(addValue: Record<string, any>): this {
    this.data = {
      ...this.data,
      payload: JSON.stringify(
        {
          ...UrlFetchAppParams.stringifiedParse(this.data.payload),
          client_payload: addValue,
        },
      )
    };
    return this;
  }

  public setAuthBearer(addValue: string): this {
    this.data = {
      ...this.data,
      "headers": { ...this.data.headers, "Authorization": `Bearer ${addValue}` }
    };
    return this;
  }

  public setAuthToken(addValue: string): this {
    this.data = {
      ...this.data,
      "headers": { ...this.data.headers, "Authorization": `token ${addValue}` }
    };
    return this;
  }

  public obfuscatedLogToConsole(): this {
    const cloned = { ...this.data, headers: { ...this.data.headers } };
    if (cloned.headers?.Authorization) {
      cloned.headers.Authorization = UrlFetchAppParams.obfuscate(
        cloned.headers.Authorization, 10
      );
    }
    const excludeNulls = null;
    const prettyPrint = 2;
    console.log(JSON.stringify(cloned, excludeNulls, prettyPrint));

    return this;
  }
  ///////////////////////
  ////    Private    ////
  ///////////////////////
  
  private static stringifiedParse(payload: any): Record<string, any> {
    try {
      return JSON.parse(payload) || {};
    }
    catch (error) {
      return {};
    }
  }
  
  private static obfuscate(value: string, showFirst: number = 0): string {
    const visibleChars = (value.length <= showFirst) ? 0 : showFirst;
    return value.substring(0, visibleChars) + "*".repeat(value.length - visibleChars);
  }

}