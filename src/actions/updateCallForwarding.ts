// src/actions/login.ts
import { Page } from "playwright";
import { BrowserSession } from "../browser";
import { obfuscate } from "../utilities";


////////////////////
////    MAIN    ////
////////////////////

export async function updateCallForwarding(
  browserSession: BrowserSession,
  phoneNumber: string,
) {
  
  try {
    const page = browserSession.page!;

    await fetchConfigPage(page);
    
    if (await needsNoChanges(page, phoneNumber)){
      return;
    }
    
    await updateContact(page, phoneNumber);
    await saveChanges(page);
    await validateChanges(page, phoneNumber);
    
  } catch (e) {
    console.error(`🟡 Call forwarding update attempt failed: ${e}`);
  }
}


/////////////////////////////
////    LOWER ORDERED    ////
/////////////////////////////

async function needsNoChanges(page: Page, phoneNumber: string): Promise<boolean> {
  if (await isCorrectValue(page, phoneNumber)) {
    console.log("Call Forwarding is already set to the correct contact.");
    return true;
    
  } else {
    console.log("Updating the On-Call phone number...");
    return false;
  }
}

async function fetchConfigPage(
  page: Page
) {
  /* Navigates to the Call-forwarding config page for updating the On-Call contact */
  console.log("Fetching config page...");
  
  await page.getByText("Call forwarding rules", { exact: true }).click();
  await page.getByRole("img", { name: "Edit" }).first().click();
}

async function getContact(page: Page): Promise<string> {
  const EXISTING_VALUE = "[data-test-id='forwardToDestination_VALUE_CONTAINER']"
    + " .react-select__single-value";
  
  const innerText = await page.locator(EXISTING_VALUE).innerText();
  const isPhoneExtension = innerText.includes("(");
    
  if (isPhoneExtension) {  
    const match = innerText.match(/.+\((?<phoneExtension>\d+)\)/);
    return match?.groups?.phoneExtension || "";
  }
  return innerText;
}

async function updateContact(
  page: Page,
  phoneNumber: string
) {
  console.log("Editing the phone number...")
  
  const PHONE_DROPDOWN = "[data-test-id='forwardToDestination_ARROW_DOWN_SOLID_ICON']";
  const PHONE_INPUT = "[data-test-id='forwardToDestination_VALUE_CONTAINER'] input";
  const SUBMIT_BUTTON = ".callForwarding-rule-edit button[data-id='SAVE']"
  
  const newPhoneNumber = normalizePhoneNumber(phoneNumber);
  
  await page.locator(PHONE_DROPDOWN).click();
  await page.fill(PHONE_INPUT, newPhoneNumber);
  
  const match = {
    IS_PHONE_EXTENSION: 6,
    IS_PHONE_NUMBER: 12,
  }
  switch(newPhoneNumber.length) {
    case match.IS_PHONE_EXTENSION:
      await page.getByText(newPhoneNumber, { exact: true }).click();
      break;
      
    case match.IS_PHONE_NUMBER:
      await page.getByText("(External number)", { exact: true }).click();
      break;
  }
  await page.locator(SUBMIT_BUTTON).click();
}

async function saveChanges(page: Page) {
  console.log("Saving changes...")
  
  const SAVE_BUTTON = "[data-test-id='SAVE']"
  const SUCCESS_CONFIRMED_BUTTON = "[data-test-id='TOAST_CLOSE_ICON']"
  
  await page.locator(SAVE_BUTTON).click();
  await page.locator(SUCCESS_CONFIRMED_BUTTON).click();
}

async function validateChanges(page: Page, phoneNumber: string) {
  await page.reload();
  await fetchConfigPage(page);
  
  if (await isCorrectValue(page, phoneNumber)) {
    console.log(
      `Successfully updated the On-Call phone number to: ${obfuscate(phoneNumber, 4)}`
    );
    return;
  }
  throw new Error("Failed to update the On-Call phone number.");
}


///////////////////////
////    HELPERS    ////
///////////////////////

async function isCorrectValue(
  page: Page,
  phoneNumber: string
): Promise<boolean> {
  const previousPhoneNumber = normalizePhoneNumber(await getContact(page));
  const newPhoneNumber = normalizePhoneNumber(phoneNumber);
  
  console.log(`Current value: ${obfuscate(previousPhoneNumber, 4)}`);
  console.log(`Target value: ${obfuscate(newPhoneNumber, 4)}`)
  
  return newPhoneNumber === previousPhoneNumber;
}

function normalizePhoneNumber(phoneNumber: string): string {
  const digits = getDigits(phoneNumber);  
  
  const match = {
    IS_PHONE_EXTENSION: 6,
    IS_PHONE_NUMBER_WITHOUT_COUNTRY_CODE: 10,
    IS_PHONE_NUMBER_WITH_COUNTRY_CODE: 11
  }
  switch(digits.length) {
    case match.IS_PHONE_EXTENSION:
      return digits;

    case match.IS_PHONE_NUMBER_WITHOUT_COUNTRY_CODE:
      return `+1${digits}`;

    case match.IS_PHONE_NUMBER_WITH_COUNTRY_CODE:
      return `+${digits}`;

    default:
      throw new Error(`Invalid phone number provided: ${phoneNumber}`);
  }
}

function getDigits(phoneNumber: string): string {
  const digitsArray = phoneNumber.match(/\d/g);
  return digitsArray
    ? digitsArray.join('')
    : '';
}
