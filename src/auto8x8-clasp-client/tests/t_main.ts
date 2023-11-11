function t_main() {
  const TEST_EMAIL_RECIPIENT = "leon_vang@trimble.com";
  

  console.log("🔷 (1/6) Loading 'Config'...");
  const config = new Config();


  console.log("🔷 (2/6) Loading 'AddressBook'...");
  const addressBook = new GoogleSheets("AddressBook").getAs(
    Contact,               // "Class"
    "contactName",         // "keysHeader"
    "contactPhoneNumber",  // "valuesHeader"
  );
  console.log(JSON.stringify(addressBook, null, 2));


  console.log("🔷 (3/6) Loading today's Calendar event...");
  const calendar = new GoogleCalendar(
    config.calendarId  // calendarId
  )
  const calendarEvent = calendar.get("on", "call");


  console.log("🔷 (4/6) Determining today's On-Call contact...");
  const contact = Determine.onCallContact(
    calendarEvent,  // calendarEvent
    addressBook,    // addressBook
  );
  console.log(JSON.stringify(contact, null, 2));


  console.log("🔷 (5/6) Running GitHub Actions automation...");
  const githubAuthToken = PropertiesServiceManager.load(config.gitHubAuthToken);
  const gitHubActions = new GitHubActions(
    config.gitHubUser,  // gitHubUser
    config.gitHubRepo,  // gitHubRepo
    githubAuthToken,    // gitHubAuthToken
  );
  const payload = {
    "CONTACT_NAME": contact.name,
    "CONTACT_PHONE_NUMBER": contact.phoneNumber,
  }
  gitHubActions.startRun(
    config.gitHubEventType,  // eventType
    payload,                 // payload
  );
  gitHubActions.awaitRunResult();


  console.log("🔷 (6/6) Sending email confirmation...");
  const mail = new GoogleMail(
    config.emailSenderName,   // senderName
    config.emailSenderAlias,  // senderEmailAlias
  )
  mail.send(
    TEST_EMAIL_RECIPIENT,                                        // emailRecipient
    format(config.emailSubject, { contactName: contact.name }),  // emailSubject
    format(config.emailBody, { contactName: contact.name}),      // emailBody
  );

}
