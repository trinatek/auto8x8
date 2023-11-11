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
    const value = userProperty || scriptProperty;
    
    if (value) {
      return value;
    }
    throw new Error(
      `🔴 [PropertiesServiceManager] Unable to locate '${propertyName}'.`
    );
  };

  /**
   * Saves a property value to the User scope.
   *
   * @param {string} value - The value of the property to save.
   * @param {string} propertyName - The name (or key) of the property to save.
   */
  public static saveToUserScope(value: string, propertyName: string): void {
    PropertiesService.getUserProperties().setProperty(propertyName, value);
    console.log(
      `[PropertiesServiceManager] Saved a value to '${propertyName}' (User Scope).`
    );
  }

  /**
   * Saves a property value to the Script scope.
   *
   * @param {string} value - The value of the property to save.
   * @param {string} propertyName - The name (or key) of the property to save.
   */
  public static saveToScriptScope(value: string, propertyName: string): void {
    PropertiesService.getScriptProperties().setProperty(propertyName, value);
    console.log(
      `[PropertiesServiceManager] Saved a value to '${propertyName}' (Script Scope).`
    );
  }
  
  ///////////////////////
  ////    PRIVATE    ////
  ///////////////////////
  
  private static loadFromUserScope(propertyName: string): string | void {
    const value = PropertiesService.getUserProperties().getProperty(propertyName);
    
    if (value) {
      console.log(
        `[PropertiesServiceManager] Loaded '${propertyName}' value from User scope.`
      );
      return value;
    }
  };

  private static loadFromScriptScope(propertyName: string): string | void {
    const value = PropertiesService.getScriptProperties().getProperty(propertyName);
    
    if (value) {
      console.log(
        `[PropertiesServiceManager] Loaded '${propertyName}' value from Script scope.`
      );
      return value;
    }
  };
  
}
