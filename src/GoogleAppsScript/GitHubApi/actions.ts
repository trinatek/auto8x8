class StartDockerContainer {
  
  private static authToken?: string;
  
  //////////////////////
  ////    Public    ////
  //////////////////////
  
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
  
  public static awaitResult(
    initialSleepSecs: number = 80,
    pollRateSecs: number = 5,
    totalTimeoutSecs: number = 300,
  ): string {
    log("[GITHUB ACTIONS] Waiting for run to complete...");
    
    this.loadAuthToken();
    Utilities.sleep(initialSleepSecs*1000);
    totalTimeoutSecs -= initialSleepSecs;
    
    while (true) {
      if (totalTimeoutSecs <= 0) {
        throw new Error(
          "[GITHUB ACTIONS] 🔴 Timed out waiting for GitHub Actions run to complete."
        );
      }
      const runInfo = this.getAwaitRunInfo();
      
      switch (runInfo.status) {
        
        case "in_progress":
          log("[GITHUB ACTIONS] Run is still in progress...");
          Utilities.sleep(pollRateSecs*1000);
          totalTimeoutSecs -= pollRateSecs;
          break;
          
        case "completed":
          log("[GITHUB ACTIONS] 🟢 Run completed.");
          return runInfo.conclusion;
          
        case 'queued':
          log("[GITHUB ACTIONS] 🟡 Run has been queued up.");
          return runInfo.status;
          
        default:
          throw new Error(`[GITHUB ACTIONS] 🔴 Run status unknown: ${runInfo.status}`);
      }
    }
  }
  
  ///////////////////////
  ////    Private    ////
  ///////////////////////
  
  private static postStartRun(
    payload: object
): GoogleAppsScript.URL_Fetch.HTTPResponse {
    log("[POST] Sending GitHub Rest API request...");
    return UrlFetchApp.fetch(
      StartDockerContainer.getStartRunUrl(),
      StartDockerContainer.getStartRunParams(payload),
    )
  }
  
  public static getAwaitRunInfo() {
    log("[GET] Sending GitHub Rest API request...");
    const response = UrlFetchApp.fetch(
      this.getAwaitRunInfoUrl(),
      this.getAwaitRunInfoParams(),
    );
    const latestRun = JSON.parse(response.getContentText()).workflow_runs[0];
    return {
      "id": latestRun.id,
      "name": latestRun.name,
      "head_branch": latestRun.head_branch,
      "display_title": latestRun.display_title,
      "event": latestRun.event,
      "status": latestRun.status,
      "conclusion": latestRun.conclusion,
      "workflow_id": latestRun.workflow_id,
      "html_url": latestRun.html_url,
      "created_at": latestRun.created_at,
      "updated_at": latestRun.updated_at,
    }
  }

  private static getStartRunUrl(): string {
    log(`[GITHUB ACTIONS][URL] ${GitHubEndpoints.DISPATCHES}`);
    return GitHubEndpoints.DISPATCHES;
  }

  private static getStartRunParams(payload: object): Record<string, any> {
    log("[GITHUB ACTIONS][PARAMS] Setting request params...");
    return new UrlFetchAppParams()
     .setMuteHttpExceptions(false)
     .setMethod(HttpMethod.POST)
     .setAccept(`application/vnd.github.everest-preview+json`)
     .setContentType("application/json")
     .setEventType(GitHubEventTypes.RUN_DOCKER_CONTAINER)
     .setClientPayload(payload)
     .setAuthToken(this.authToken!)
     .setMuteHttpExceptions(false)
     .obfuscatedLogToConsole()
     .get();
  }

  private static getAwaitRunInfoUrl(): string {
    log(`[GITHUB ACTIONS][URL] ${GitHubEndpoints.RUNS}`);
    return GitHubEndpoints.RUNS;
  }

  private static getAwaitRunInfoParams(): Record<string, any> {
    log("[GITHUB ACTIONS][PARAMS] Setting request params...");
    return new UrlFetchAppParams()
     .setMethod(HttpMethod.GET)
     .setAccept("application/vnd.github.v3+json")
     .setAuthBearer(this.authToken!)
     .setMuteHttpExceptions(false)
     .obfuscatedLogToConsole()
     .get();
  }
  
  private static loadAuthToken(): void {
    if (!this.authToken) {
      this.authToken = GitHubAuthToken.load();
    }
  }
}
