class GoogleCalendar {
  public calendar: GoogleAppsScript.Calendar.Calendar;

  constructor(public calendarId: string) {
    this.calendar = CalendarApp.getCalendarById(calendarId);
    this.validateCalendar(this.calendar);
  }
  
  //////////////////////
  ////    Public    ////
  //////////////////////

  public getOnCallEvent(): GoogleAppsScript.Calendar.CalendarEvent {
    log("[GOOGLE CALENDAR] Retrieving On-Call Calendar events...");

    const onCallEvents = this.getTodaysAllOnCallEvents();
    const match = {
      "onOneMatchedEvent": (onCallEvents && onCallEvents.length === 1),
      "onMultipleMatches": (onCallEvents && onCallEvents.length > 0),
      "onNoEventsFound": (!onCallEvents || onCallEvents.length === 0),
      "onUnknownError": true,
    };
    switch (true) {

      case match.onOneMatchedEvent:
        log("[GOOGLE CALENDAR] On-Call Calendar event found.");
        this.logToConsole(onCallEvents[0]);
        break;

      case match.onMultipleMatches:
        log(
          "[GOOGLE CALENDAR] Multiple On-Call Calendar events found. Returning the ",
          "earliest event."
        );
        const earliestOnCallEvent = this.sortByStartTimes(onCallEvents)[0];
        this.logToConsole(earliestOnCallEvent);
        return earliestOnCallEvent;

      case match.onNoEventsFound:
        throw new Error(
          "[GOOGLE CALENDAR] No Events found to contain both words 'on' and 'call'."
        );

      case match.onUnknownError:
        throw new Error("[GOOGLE CALENDAR] Unknown error occurred.");
    }
    return onCallEvents[0];
  }
  
  ///////////////////////
  ////    Private    ////
  ///////////////////////

  private validateCalendar(calendar: GoogleAppsScript.Calendar.Calendar): void {
    if (!calendar) {
      throw new Error("Calendar not found.");
    }
  }

  private getTodaysAllOnCallEvents(): GoogleAppsScript.Calendar.CalendarEvent[] {
    log("[GOOGLE CALENDAR] Getting today's events...")

    const allOnCallEventsToday = this.calendar.getEventsForDay(this.getTodaysStartTime())
      .filter(
        event => {
          const title = event.getTitle().toLowerCase();
          return title.includes("on") && title.includes("call");
        }
      );
    return allOnCallEventsToday;
  }

  private sortByStartTimes(
    events: GoogleAppsScript.Calendar.CalendarEvent[]
  ): GoogleAppsScript.Calendar.CalendarEvent[] {

    return [...events].sort(
      (a, b) => a.getStartTime().getTime() - b.getStartTime().getTime()
    );
  }

  private getTodaysStartTime(): Date {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  }

  private timezone(date: GoogleAppsScript.Base.Date): string {
    return Utilities.formatDate(date, Config.timezone, 'yyyy-MM-dd HH:mm:ss zzz');
  }

  private logToConsole(event: GoogleAppsScript.Calendar.CalendarEvent): void {
    log(`--------    Today's On-Call Calendar Event    --------`);
    log(`Event Title: ${event.getTitle()}`);
    log(`Event Start: ${this.timezone(event.getStartTime())}`);
    log(`Event End: ${this.timezone(event.getEndTime())}`);
    log(`-------------------------------------------------------`);
  }
}
