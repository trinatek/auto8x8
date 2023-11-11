class Determine {

  /**
   * Determines the on-call contact from a calendar event based on the event's title.
   *
   * @param {GoogleAppsScript.Calendar.CalendarEvent} onCallEvent - Calendar event
   *   for parsing.
   * @param {Contact[]} availableContacts - An array of contacts to compare.
   * @returns {Contact} - The matching On-Call contact to the calendar event.
   * @throws {Error} - Throws an error if a matching On-Call contact cannot be
   *   determined.
   */
  public static onCallContact(
    onCallEvent: GoogleAppsScript.Calendar.CalendarEvent,
    availableContacts: Contact[],
  ): Contact {

    const calendarTitle = onCallEvent.getTitle().toLocaleLowerCase();
    const getLeftMost = (array: string[]) => array[0];
    const getRightMost = (array: string[]) => array[array.length - 1];

    for (const contact of availableContacts) {
      switch (true) {
        case calendarTitle.includes("covering"):
          const contactLeftOfCovering = getLeftMost(calendarTitle.split("covering"));
          if (contactLeftOfCovering.includes(contact.name.toLowerCase())) {
            console.log(`[Determine] '${contact.name}' is covering On-Call today.`)
            return contact;
          }

        case calendarTitle.includes("for"):
          const contactLeftOfFor = getLeftMost(calendarTitle.split("for"));
          if (contactLeftOfFor.includes(contact.name.toLowerCase())) {
            console.log(`[Determine] '${contact.name}' is covering On-Call today.`)
            return contact;
          }

        case calendarTitle.includes("covered"):
          const contactRightOfCovered = getRightMost(calendarTitle.split("covered"));
          if (contactRightOfCovered.includes(contact.name.toLowerCase())) {
            console.log(`[Determine] '${contact.name}' is covering On-Call today.`)
            return contact;
          }

        case calendarTitle.includes("by"):
          const contactRightOfBy = getRightMost(calendarTitle.split("by"));
          if (contactRightOfBy.includes(contact.name.toLowerCase())) {
            console.log(`[Determine] '${contact.name}' is covering On-Call today.`)
            return contact;
          }

        default:
          if (calendarTitle.includes(contact.name.toLowerCase())) {
            console.log(`[Determine] '${contact.name}' is On-Call today.`)
            return contact;
          }
      }
    };
    throw new Error(
      "🔴 [Determine] Could not determine On-Call contact from Calendar event."
    );
  }

}