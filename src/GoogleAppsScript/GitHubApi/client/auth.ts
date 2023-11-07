
class GitHubAuthToken {
  
  public static load(
    propertyName: string = PropertiesServiceNames.GITHUB_AUTH_TOKEN,
  ): string {
    
    const userProperty = this.fromScriptScope(propertyName);
    const scriptProperty = this.fromUserScope(propertyName);
    const token = userProperty || scriptProperty;
    
    if (token) {
      return token;
    }
    throw new Error(
      `Missing GitHub API token in User/Script scopes for property: '${propertyName}'.`
    );
  };

  public static saveToUserScope(
    token: string,
    propertyName: string = PropertiesServiceNames.GITHUB_AUTH_TOKEN,
  ): void {
    
    PropertiesService.getUserProperties().setProperty(propertyName, token);
    log(`Saved GitHub API token to User scope as: '${propertyName}'.`,);
  }

  public static saveToScriptScope(
    token: string,
    propertyName: string = "GITHUB_AUTH_TOKEN",
  ): void {
    
    PropertiesService.getScriptProperties().setProperty(propertyName, token);
    log(`Saved GitHub API token to Script scope as: '${propertyName}'.`,);
  }
  
  private static fromUserScope(
    propertyName: string,
  ): Optional<string> {
    
    const token = PropertiesService.getUserProperties().getProperty(propertyName);
    
    if (token) {
      log(
        `Loaded GitHub API token from User scope, property name: '${propertyName}'.`
      );
      return token;
    }
  };

  private static fromScriptScope(
    propertyName: string,
  ): Optional<string> {
    
    const token = PropertiesService.getScriptProperties().getProperty(propertyName);
    
    if (token) {
      log(
        `Loaded GitHub API token from Script scope, property name: '${propertyName}'.`
      );
      return token;
    }
  };
  
}




// /**
//  * Manages GitHub API tokens with a focus on security and scope. Intended for use
//  * as a dependency for the GitHubClient class.
//  * 
//  * If no PropertiesService properties are configured either on the script or user scope,
//  * an error will be thrown. You'll first need to use GitHubAuthToken.saveToScriptScope()
//  * or GitHubAuthToken.saveToUserScope().
//  * 
//  * Once the code has been executed to set the token, the code can later be removed so
//  * that the token doesn't remain in the script as plain text.
//  *
//  * @example
//  * // If a User or Script property is already set, this may be instantiate without args.
//  * const apiToken = new GitHubAuthToken();
//  * 
//  * // Then, pass the instantiated object directly into the GitHubClient constructor.
//  * const api = new GitHubClient(apiToken);
//  * 
//  * @param {string} [token=""] - The GitHub API token. Optional; if provided, it will be
//  * saved to script scope.
//  * 
//  * @param {string} [propertyName="GITHUB_AUTH_TOKEN"] - The name of the property to use
//  * for storing the token.
//  */
// class GitHubAuthToken {
//   private _token?: string
  
//   constructor(token: string = "", public propertyName: string = "GITHUB_AUTH_TOKEN") {
//     if (token.trim()) {
//       this.saveToScriptScope(token);
//     }
//   }
//   // Public methods

//   public handoff(client: GitHubClient | GitHubRequest): string {
//     return this.token;
//   }
  
//   public saveToUserScope(token: string): void {
//     console.log("Saving GitHub token to user scope...");
    
//     PropertiesService.getUserProperties().setProperty(this.propertyName, token);
//     this._token = token;
//   }

//   public saveToScriptScope(token: string): void {
//     console.log("Saving GitHub token to script scope...");
    
//     PropertiesService.getScriptProperties().setProperty(this.propertyName, token);
//     this._token = token;
//   }
  
//   public get obfuscated(): string {
//     const showFirst = (this.token.length <=  6) ? 0 : 4;
//     return this.token.substring(0, showFirst) + '*'.repeat(this.token.length - showFirst);
//   }
//   // Private methods

//   private loadFromPropertiesService(): string {
//     return this.getFromUserScope() || this.getFromScriptScope() || "";
//   }

//   private getFromUserScope(): string | null {
//     console.log("Getting GitHub token from user scope...");
//     return PropertiesService.getUserProperties().getProperty(this.propertyName) || null;
//   }

//   private getFromScriptScope(): string | null {
//     console.log("Getting GitHub token from script scope...");
//     return PropertiesService.getScriptProperties().getProperty(this.propertyName) || null;
//   }

//   private get token(): string {
//     this._token = this.loadFromPropertiesService();
      
//     if (this._token) {
//       console.log(`Using GitHub API token: ${this.obfuscated}`);
//       return this._token; 
//     }
    
//     throw new Error(`Unable to locate GitHub API Token under '${this.propertyName}'.`);
//   }
// }

