/**
 * The Auto8x8 configuration object for this project, loaded from a Google Sheet.
 *
 * @property {string} calendarId - The ID of the calendar.
 * @property {string} gitHubUser - The GitHub username.
 * @property {string} gitHubRepo - The GitHub repository name.
 * @property {string} gitHubAuthToken - The GitHub authentication token.
 * @property {string} gitHubEventType - The type of GitHub event.
 * @property {string} emailSenderName - The name of the email sender.
 * @property {string} emailSenderAlias - The alias of the email sender.
 * @property {string} emailRecipient - The email recipient address.
 * @property {string} emailSubject - The subject line of the email.
 * @property {string} emailBody - The body content of the email.
 */
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

  /*
   * @param {string} [sheetName="Config"] - The name of the Google Sheet to load.
   * @param {string} [configKey="configKey"] - The header text of the column to be used
   *   as keys.
   * @param {string} [configValue="configValue"] - The header text of the column to be
   *   used as values.
   */
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
        `🔴 [config] The following values are missing from these keys in the sheet:` +
        `${missingKeyValues.map(k => `\n  • ${k}`)}`,
      );
    }
  }

}