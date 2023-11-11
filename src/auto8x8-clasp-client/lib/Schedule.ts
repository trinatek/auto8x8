class Schedule {
  
  public static nextJob(functionName: string, time: string = "7:59"): void {
    // Todo: Need to implement.
    
    // 1. If a trigger already exists for today and at the scheduled time, then do nothing.
    
    // 2. Else, continue to create a new trigger for today and at the scheduled time.
    
    
  }
  
  /////////////////////////
  ////    Protected    ////
  /////////////////////////

  protected static getTodaysTriggers(): void {
    // Todo: Need to implement.
  }
  
  protected static setTodaysTriggers(time: string): void {
    // Todo: Need to implement.
  }
  
  protected static deleteAllTriggers(): void {
    // Todo: Need to implement.
  }
  
}