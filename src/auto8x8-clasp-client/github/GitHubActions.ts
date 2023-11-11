class GitHubActions {
  
  public baseUrl: string;
  public RunResults: typeof GitHubActionsRunResults = GitHubActionsRunResults;
  
  /**
   * @param gitHubUser - The github username of the repository owner.
   * @param gitHubRepo - The name of the GitHub repository.
   * @param authToken - GitHub Rest API authentication token.
   * @param hostUrl - The base URL for the GitHub API (defaults to 'api.github.com').
   */
  constructor(
    public gitHubUser: string,
    public gitHubRepo: string,
    private authToken: string,
    public hostUrl: string = "https://api.github.com",
  ) {
    this.baseUrl = `${hostUrl}/repos/${gitHubUser}/${gitHubRepo}`;
  }

  //////////////////////
  ////    Public    ////
  //////////////////////
  
  /**
   * Triggers a GitHub Actions workflow run with a custom event type and payload.
   * 
   * @param eventType - Name of the custom event type to trigger the workflow.
   * @param payload - Client payload to send with the event to GitHub Actions.
   * @returns The HTTP response from the GitHub API.
   * @throws Will throw an error if the request to start the Docker container fails.
   */
  public startRun(
    eventType: string,
    payload: object,
  ): GoogleAppsScript.URL_Fetch.HTTPResponse {

    console.log("[GitHubActions] Starting Docker container...");
    
    const response = UrlFetchApp.fetch(
      `${this.baseUrl}/dispatches`,
      {
        "method": "post",
        "muteHttpExceptions": false,
        "contentType": "application/json",
        "headers": {
          "Accept": "application/vnd.github.everest-preview+json",
          "Authorization": `token ${this.authToken}`
        },
        "payload": JSON.stringify(
          { "event_type": eventType, "client_payload": payload }
        ),
      }
    );
    if (response.getResponseCode()) {
      console.log(`[GitHubActions] Started Docker container.`);
      return response;
    }
    throw new Error("[GitHubActions] 🔴 Failed to start Docker container.");
  }
  
  /**
   * Awaits the result of a GitHub Actions workflow run, polling until completion or
   *   timeout.
   * 
   * @param initialSleepSecs - Initial delay before polling begins.
   * @param pollRateSecs - Frequency of polling for run completion.
   * @param totalTimeoutSecs - Total timeout for the run to complete.
   * @returns The conclusion of the run if completed successfully.
   * @throws Error is thrown if the run fails to complete prior to the timeout period.
   */
  public awaitRunResult(
    initialSleepSecs: number = 80,
    pollRateSecs: number = 5,
    totalTimeoutSecs: number = 300,
  ): string {
    
    console.log("[GitHubActions] Waiting for run to complete...");
    
    Utilities.sleep(initialSleepSecs*1000);
    totalTimeoutSecs -= initialSleepSecs;
    
    while (true) {
      
      if (totalTimeoutSecs <= 0) {
        throw new Error(
          "[GitHubActions] 🔴 Timed out waiting for GitHub Actions run to complete.",
        );
      }
      const runInfo = this.getRunInfo();
      
      switch (runInfo.status) {
        
        case this.RunResults.IN_PROGRESS:
          console.log("[GitHubActions] Run is still in progress...");
          Utilities.sleep(pollRateSecs*1000);
          totalTimeoutSecs -= pollRateSecs;
          break;
          
        case this.RunResults.COMPLETED:
          console.log("[GitHubActions] Run completed succssfully.");
          return runInfo.conclusion;
          
        default:
          throw new Error(
            `[GitHubActions] 🔴 Run failed to complete its run in a timely manner, ` +
            `status: ${runInfo.status}`
          );
      }
      
    }
  }

  /////////////////////////
  ////    Protected    ////
  /////////////////////////

  protected getRunInfo(): Record<string, any> {
    console.log(`[GitHubActions] Retrieving latest '${this.gitHubRepo}' run info...`);

    const response = UrlFetchApp.fetch(
      `${this.baseUrl}/actions/runs`,
      {
        "method": "get",
        "muteHttpExceptions": false,
        "headers": {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": `Bearer ${this.authToken}`,
        },
      },
    );
    return JSON.parse(response.getContentText()).workflow_runs[0];
  }
  
}


/////////////////////
////    Enums    ////
/////////////////////

enum GitHubActionsRunResults {
  ACTION_REQUIRED = "action_required",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  FAILURE = "failure",
  IN_PROGRESS = "in_progress",
  NEUTRAL = "neutral",
  PENDING = "pending",
  QUEUED = "queued",
  REQUESTED = "requested",
  SKIPPED = "skipped",
  STALE = "stale",
  SUCCESS = "success",
  TIMED_OUT = "timed_out",
  WAITING = "waiting",
}
