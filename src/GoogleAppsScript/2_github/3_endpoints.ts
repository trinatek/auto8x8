class GitHubEndpoints {
  // Rest API URls / Endpoints
  public static readonly baseUrl: string =
    `https://api.github.com/repos/${Config.gitHubUser}/${Config.gitHubRepo}`
  
  public static readonly Endpoints: Record<string, string> = {
    "DISPATCHES": `${this.baseUrl}/dispatches`,
    "RUNS": `${this.baseUrl}/actions/runs`,
  };
}