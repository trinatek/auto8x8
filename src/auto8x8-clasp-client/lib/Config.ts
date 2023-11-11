class Config {
  
  [key: string]: any;

  public calendarId: string = "";
  public gitHubUser: string = "";
  public gitHubRepo: string = "";
  public gitHubAuthToken: string = "";
  public gitHubEventType: string = "";
  public emailSenderName: string = "";
  public emailSenderAlias: string = "";
  public emailRecipient: string = "";
  public emailSubject: string = "";
  public emailBody: string = "";

  constructor(
    sheetName: string = "Config",
    configKey: string = "configKey",
    configValue: string = "configValue",
  ) {
    const config = new GoogleSheets(sheetName).get(configKey, configValue);
    this.loadAsProperties(config);
    this.validateNoMissingKeys(config);
    this.validateNoMissingValues();
    
    console.log(`[Config] Loaded config properties from '${sheetName}' Google Sheet.`)
  }

  ////////////////////////
  ////   Protected    ////
  ////////////////////////

  protected loadAsProperties(config: Record<string, any>): void {
    const properties = Object.keys(config)
      .filter(k => this.hasOwnProperty(k))
      .reduce((acc, k) => ({ ...acc, [k]: config[k] }), {});

    Object.assign(this, properties);
  }

  protected validateNoMissingKeys(config: Record<string, any>): void {
    const missingKeys = Object.keys(this)
      .filter(key => !key.startsWith("_"))
      .filter(key => !(key in config));

    if (missingKeys.length) {
      throw new Error(
        `[config] The following keys are missing from the sheet:` +
        `${missingKeys.map(k => `\n  • ${k}`)}`,
      );
    }
  }

  protected validateNoMissingValues(): void {
    const missingKeyValues = Object.keys(this).filter(
      key => !key.startsWith("_") && !`${this[key]}`.trim().length,
    );

    if (missingKeyValues.length) {
      throw new Error(
        `[config] 🔴 The following values are missing from these keys in the sheet:` +
        `${missingKeyValues.map(k => `\n  • ${k}`)}`,
      );
    }
  }
}