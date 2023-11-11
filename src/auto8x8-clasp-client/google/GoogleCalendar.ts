class GoogleCalendar {
  
  public calendar: GoogleAppsScript.Calendar.Calendar;

  /**
   * @param calendarId - The ID of the calendar to be accessed.
   * @throws Will throw an error if the calendar with the specified ID is not found.
   */
  constructor(public calendarId: string) {
    this.calendar = CalendarApp.getCalendarById(calendarId);
    
    if (!this.calendar) {
      throw new Error("🔴 [GoogleCalendar] Calendar not found.");
    }
  }
  
  //////////////////////
  ////    Public    ////
  //////////////////////
  
  /**
   * Retrieves the first event for today that matches the given keywords.
   * 
   * @param keywords - A list of keywords to filter today's calendar events.
   * @returns The earliest CalendarEvent for today that matches all keywords.
   * @throws Will throw an error if no matching event is found for today.
   */
  public get(...keywords: string[]): GoogleAppsScript.Calendar.CalendarEvent {
    const todaysEvents = this.filterEventsByKeywords(...keywords);
    const matchedEvent = this.sortByEarliest(todaysEvents)[0];

    if (matchedEvent) {
      console.log(
        `[GoogleCalendar] Found a matching event.\n` +
        `  • Title: ${matchedEvent.getTitle()}\n` +
        `  • Start: ${matchedEvent.getStartTime()}\n` +
        `  • End: ${matchedEvent.getEndTime()}\n`
      );
      return matchedEvent;
    }
    throw new Error("🔴 [GoogleCalendar] No matching event found.");
  }

  /////////////////////////
  ////    Protected    ////
  /////////////////////////

  protected filterEventsByKeywords(
    ...keywords: string[]
  ): GoogleAppsScript.Calendar.CalendarEvent[] {

    return this.calendar
      .getEventsForDay(this.getTodaysStartTime())
      .filter(event => {
        const title = event.getTitle().toLowerCase();
        return keywords.every(
          keyword => title.includes(keyword.toLowerCase())
        );
      });
  }

  protected sortByEarliest(
    events: GoogleAppsScript.Calendar.CalendarEvent[]
  ): GoogleAppsScript.Calendar.CalendarEvent[] {
    
    return [...events].sort(
      (a, b) => a.getStartTime().getTime() - b.getStartTime().getTime()
    );
  }

  protected getTodaysStartTime(): Date {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  }
  
}
