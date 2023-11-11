function test() {

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
  // const gitHubActions = new GitHubActions(
  //   config.gitHubUser,              // gitHubUser
  //   config.gitHubRepo,              // gitHubRepo
  //   PropertiesServiceManager.load(  // gitHubAuthToken
  //     config.gitHubAuthToken,
  //   ),
  // )
  // gitHubActions.startRun(config.gitHubEventType);
  // gitHubActions.awaitRunResult();


  console.log("🔷 (6/6) Sending email confirmation...");
  const mail = new GoogleMail(
    config.emailSenderName,   // senderName
    config.emailSenderAlias,  // senderEmailAlias
  )
  mail.send(
    config.emailRecipient,                                       // emailRecipient
    format(config.emailSubject, { contactName: contact.name }),  // emailSubject
    format(config.emailBody, { contactName: contact.name}),      // emailBody
  );

}


////////////////////////////////////////////////////////////////////////////////////////