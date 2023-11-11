import config from "./config.json";


import * as browser from './browser';
import * as actions from './actions';


(async function main() {
  console.log("Calling main...")
  
  const secrets = {
    "loginUser": process.env.LOGIN_USER,
    "loginPassword": process.env.LOGIN_PASSWORD,
  }
  const contact = {
    "name": process.env.CONTACT_NAME,
    "phoneNumber": process.env.CONTACT_PHONE_NUMBER,
  }
  
  if (!secrets.loginUser || !secrets.loginPassword || !contact.phoneNumber) {
    throw new Error("Missing required environment variables. Exiting...");
  }
  
  const browserSession = await browser.getBrowserSession(config.headless);
  
  ////////////////////////
  ////    1. LOGIN    ////
  ////////////////////////
  
  const login = {
    "logMsg": "⚪ Logging into 8x8...",
    "callbackFn": actions.login,
    "callbackArgs": [browserSession, secrets.loginUser, secrets.loginPassword],
    "maxRetries": 3,
    "throwError": true,
  }
  await actions.callWithRetryAttempts(
    login.logMsg,
    login.callbackFn,
    login.callbackArgs,
    login.maxRetries,
    login.throwError,
  );
  
  /////////////////////////////////////////////////
  ////    2. UPDATE CALL FORWARDING CONTACT    ////
  /////////////////////////////////////////////////
  
  const updateCallForwarding = {
    "logMsg": "⚪ Updating the Call Forwarding contact...",
    "callbackFn": actions.updateCallForwarding,
    "callbackArgs": [browserSession, contact.phoneNumber],
    "maxRetries": 3,
    "throwError": true,
  }
  await actions.callWithRetryAttempts(
    updateCallForwarding.logMsg,
    updateCallForwarding.callbackFn,
    updateCallForwarding.callbackArgs,
    updateCallForwarding.maxRetries,
    updateCallForwarding.throwError,
  );
  
  /////////////////////////////////////////
  ////    3. SEND TEXT NOTIFICATION    ////
  /////////////////////////////////////////
  
  const sendTextNotification = {
    "logMsg": "⚪ Sending text notification to new Call Forwarding contact...",
    "callbackFn": actions.sendTextNotification,
    "callbackArgs": [
      browserSession,
      contact.phoneNumber,
      "🚨 On-call forwarding contact has been updated. You're it!",
    ],
    "maxRetries": 3,
    "throwError": false,
  }
  await actions.callWithRetryAttempts(
    sendTextNotification.logMsg,
    sendTextNotification.callbackFn,
    sendTextNotification.callbackArgs,
    sendTextNotification.maxRetries,
    sendTextNotification.throwError,
  );
  
  ///////////////////////
  ////    4. DONE    ////
  ///////////////////////
  
  // Return with code 0, indicating a success
  process.exit(0);
  
})();
