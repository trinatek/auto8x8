class GitHubEndpoints {
  private static BASE = `https://api.github.com/repos/${Config.gitHubUser}/${Config.gitHubRepo}`
  
  public static DISPATCHES = `${this.BASE}/dispatches`
  public static RUNS = `${this.BASE}/actions/runs`
}