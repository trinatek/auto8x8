(function main() {
  console.log("🟢 Calling main...")
  
  const contactName = process.env.CONTACT_NAME;
  const contactPhoneNumber = process.env.CONTACT_PHONE_NUMBER;

  // Testing failed job
  throw new Error("🔴 Test error has been thrown...");
  
  console.log(`    • Contact name (process.env.CONTACT_NAME): '${contactName}'`);
  console.log(`    • Contact phone number (process.env.CONTACT_PHONE_NUMBER): '${contactPhoneNumber}'`);
  console.log("Done.");
})();
