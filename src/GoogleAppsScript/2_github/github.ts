class GitHub {
  // Endpoints
  public static Endpoints: GitHubEndpoints = GitHubEndpoints;
  
  // Enums
  public static EventTypes: typeof GitHubEventTypes = GitHubEventTypes;
  public static Results: typeof GitHubResults = GitHubResults;
  public static PropertiesServiceKeys: typeof GitHubPropService = GitHubPropService;
  
  public static send(
    payload: object,
  ): GoogleAppsScript.URL_Fetch.HTTPResponse {
    log("[GITHUB ACTIONS] Starting Docker container on GitHub Actions...");
    
    this.loadAuthToken();
    const response = StartDockerContainer.postStartRun(payload)
    const responseCode = (response)
      ? response.getResponseCode()
      : null;
      
    log(response.getContentText());
    
    switch (responseCode) {
      
      case 204:
        log(`[GITHUB ACTIONS][${responseCode}] Started Docker container.`);
        return response;
        
      case null:
        throw new Error("[GITHUB ACTIONS] 🔴 Failed to start Docker container.");
        
      default:
        throw new Error(
          `[GITHUB ACTIONS][${responseCode}] 🔴 Failed to start Docker container. ` +
          `No response received from GitHub Rest API: ${response.getContentText()}`,
        );
    }
  }
}