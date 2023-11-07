class Determine {

  public static onCallContact(
    onCallEvent: GoogleAppsScript.Calendar.CalendarEvent,
    availableContacts: Contact[],

  ): Contact | void {

    const calendarTitle = onCallEvent.getTitle().toLocaleLowerCase();
    const getLeftMost = (array: string[]) => array[0];
    const getRightMost = (array: string[]) => array[array.length - 1];

    for (const contact of availableContacts) {
      switch (true) {
        case calendarTitle.includes("covering"):
          const contactLeftOfCovering = getLeftMost(calendarTitle.split("covering"));
          if (contactLeftOfCovering.includes(contact.name.toLowerCase())) {
            return contact;
          }

        case calendarTitle.includes("for"):
          const contactLeftOfFor = getLeftMost(calendarTitle.split("for"));
          if (contactLeftOfFor.includes(contact.name.toLowerCase())) {
            return contact;
          }

        case calendarTitle.includes("covered"):
          const contactRightOfCovered = getRightMost(calendarTitle.split("covered"));
          if (contactRightOfCovered.includes(contact.name.toLowerCase())) {
            return contact;
          }

        case calendarTitle.includes("by"):
          const contactRightOfBy = getRightMost(calendarTitle.split("by"));
          if (contactRightOfBy.includes(contact.name.toLowerCase())) {
            return contact;
          }

        default:
          if (calendarTitle.includes(contact.name.toLowerCase())) {
            return contact;
          }
      }
    };
    throw new Error("Could not determine On-Call contact from Calendar event.");
  }
  
}