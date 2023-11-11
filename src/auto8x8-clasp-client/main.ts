function main() {

  console.log("🔷 (1/6) Loading 'Config'...");
  const config = new GoogleSheets("Config").get(
    "configKey",                          // "keysHeaderText"
    "configValue",                        // "valuesHeaderText"
  );
  const missingConfigs = [
    "calendarId",
    "gitHubUser",
    "gitHubRepo",
    "gitHubAuthToken",
    "gitHubEventType",
    "emailSenderName",
    "emailSenderAlias",
    "emailRecipient",
    "emailSubject",
    "emailBody",
  ].filter(key => !config[key].trim());

  if (missingConfigs.length > 0) {
    throw new Error(
      `🔴 [config] The following required configurations are missing:\n` +
      `${JSON.stringify(missingConfigs, null, 2)}`,
    );
  }

  console.log("🔷 (2/6) Loading 'AddressBook'...");
  const addressBook = new GoogleSheets("AddressBook").getAs(
    Contact,                              // "Class"
    "contactName",                        // "keysHeaderText"
    "contactPhoneNumber",                 // "valuesHeaderText"
  );
  console.log(JSON.stringify(addressBook, null, 2));


  console.log("🔷 (3/6) Loading today's Calendar event...");
  const calendar = new GoogleCalendar(
    config.calendarId                     // calendarId
  )
  const calendarEvent = calendar.get("on", "call");


  console.log("🔷 (4/6) Determining today's On-Call contact...");
  const contact = Determine.onCallContact(
    calendarEvent,                        // calendarEvent
    addressBook,                          // addressBook
  );


  console.log("🔷 (5/6) Running GitHub Actions automation...");
  const gitHubActions = new GitHubActions(
    config.gitHubUser,                    // gitHubUser
    config.gitHubRepo,                    // gitHubRepo
    PropertiesServiceManager.load(        // gitHubAuthToken
      config.gitHubAuthToken,
    ),
  )
  gitHubActions.startRun(
    config.gitHubEventType,               // gitHubEventType
    {                                     // payload (Docker container env variables)
      "CONTACT_NAME": contact.name,
      "CONTACT_PHONE_NUMBER": contact.phoneNumber,
    }
  );
  gitHubActions.awaitRunResult();


  // Todo: Need to get results from the GitHubActions to know whether or not to send email
  

  console.log("🔷 (6/6) Sending email confirmation...");
  const mail = new GoogleMail(
    config.emailSenderName,               // senderName
    config.emailSenderAlias,              // senderEmailAlias
  )
  mail.send(
    config.emailRecipient,                // emailRecipient
    config.emailSubject,                  // emailSubject   // todo: Add formatting
    config.emailBody,                     // emailBody
  );
  
  console.log("🟢 Done. Successfully completed On-Call automation.");

}
