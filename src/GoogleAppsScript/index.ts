function main() {
  
  // 1. Get calendar event and available On Call contacts
  const calendarEvent = new GoogleCalendar(Config.onCallCalendarId).getOnCallEvent();
  const addressBook = new AddressBook().getContacts();
  
  // 2. Determine the On Call contact for today
  const contact = Determine.onCallContact(calendarEvent, addressBook);

  // 3. Send request to GitHub Rest API to run the Docker container automation
  const payload = {
    "CONTACT_NAME": contact?.name,
    "CONTACT_PHONE_NUMBER": contact?.phoneNumber,
  };
  StartDockerContainer.send(payload);
  
  // 4. Wait until the Docker container automation has completed, and handle result
  switch(StartDockerContainer.awaitResult()) {
    
    case GitHubRunResults.SUCCESS:
      log("🟢 GitHub Actions run completed successfully.");
      break;
      
    default:
      log("🔴 GitHub Actions run attempt resulted in a failure.");
      throw new Error("🔴 GitHub Actions run attempt resulted in a failure.");
  }
  
  // 5. Send an email notification to the Integrations distro
  const email = {
    "recipient": Config.emailNotificationRecipient,
    "subject": `${contact?.name} is On-Call.`,
    "body": "🐕 Wow, oncall switch. Always alert. So responsibility.",
    "senderName": "Auto8x8",
    "senderEmail": "leon_vang@trimble.com",
  }
  GoogleMail.send(
    email.recipient,
    email.subject,
    email.body,
    email.senderName,
    email.senderEmail,
  );
}
