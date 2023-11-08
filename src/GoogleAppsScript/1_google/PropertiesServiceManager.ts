/**
 * PropertiesServiceManager provides a static interface to save and load Google
 * PropertiesService key/value pairs within a Google Apps Script environment. This is
 * is pretty much Google's answer to environment variables at the moment.
 */
class PropertiesServiceManager {
  
  //////////////////////
  ////    PUBLIC    ////
  //////////////////////
  
  /**
   * Loads a property value from either the User or Script scope. It first attempts to
   * load from the User scope, then the Script scope. If the property is not found,
   * an error is thrown.
   *
   * @param {string} propertyName - The name of the property to load.
   * @returns {string} The value of the loaded property.
   */
  public static load(propertyName: string): string {
    const userProperty = this.loadFromScriptScope(propertyName);
    const scriptProperty = this.loadFromUserScope(propertyName);
    const stringValue = userProperty || scriptProperty;
    
    if (stringValue) {
      return stringValue;
    }
    throw new Error(
      `[PROPERTIES SERVICE] 🔴 Unable to locate '${propertyName}'.`
    );
  };

  /**
   * Saves a property value to the User scope.
   *
   * @param {string} stringValue - The value of the property to save.
   * @param {string} propertyName - The name (or key) of the property to save.
   */
  public static saveToUserScope(stringValue: string, propertyName: string): void {
    PropertiesService.getUserProperties().setProperty(propertyName, stringValue);
    log(`[PROPERTIES SERVICE] Saved a value to '${propertyName}' (User Scope).`,);
  }

  /**
   * Saves a property value to the Script scope.
   *
   * @param {string} stringValue - The value of the property to save.
   * @param {string} propertyName - The name (or key) of the property to save.
   */
  public static saveToScriptScope(stringValue: string, propertyName: string): void {
    PropertiesService.getScriptProperties().setProperty(propertyName, stringValue);
    log(`[PROPERTIES SERVICE] Saved a value to '${propertyName}' (Script Scope).`,);
  }
  
  ///////////////////////
  ////    PRIVATE    ////
  ///////////////////////
  
  private static loadFromUserScope(propertyName: string): string | void {
    const stringValue = PropertiesService.getUserProperties().getProperty(propertyName);
    
    if (stringValue) {
      log(`[PROPERTIES SERVICE] Loaded '${propertyName}' value from User scope.`);
      return stringValue;
    }
  };

  private static loadFromScriptScope(propertyName: string): string | void {
    const stringValue = PropertiesService.getScriptProperties().getProperty(propertyName);
    
    if (stringValue) {
      log(`[PROPERTIES SERVICE] Loaded '${propertyName}' value from Script scope.`);
      return stringValue;
    }
  };
  
}
