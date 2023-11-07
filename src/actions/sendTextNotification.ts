// src/actions/change-notification.ts
import { Page } from "playwright";
import { BrowserSession } from "../browser";

export async function sendTextNotification(
  browserSession: BrowserSession,
  phoneNumber: string,
  textMessage: string = "Callforwarding has been updated to your phone number.",
) {
  try {
    const page = browserSession.page!;

    await fetchMessagingPage(page);
    await deployAutoDialogeClosers(page);
    await fetchNewMessageDialog(page);
    await selectRecipient(page, phoneNumber);
    await sendTextMessage(page, textMessage);
    
  } catch (e) {
    console.error(`🟡 Text notification attempt failed: ${e}`);
  }
}

async function fetchMessagingPage(page: Page) {
  console.log("Fetching messaging page...");
  await page.goto("https://work.8x8.com/conversations/messages");
}

async function fetchNewMessageDialog(page: Page) {
  console.log("Fetching new text message dialogue...")
  const CONTAINER = "[data-qa='master-detail']";
  const NEW_MSG_BUTTON = `${CONTAINER} [data-qa='floating-button']`;
  const NEW_DRAFT_BUTTON = `${CONTAINER} [data-qa='message'] button`;
  page.locator(NEW_MSG_BUTTON).click({ timeout: 90000 });
  page.locator(NEW_DRAFT_BUTTON).click();
}

async function selectRecipient(page: Page, phoneNumber: string) {
  console.log("Selecting the text message recipient...")
  const INPUT_FIELD = "input[data-qa='contact-picker-search-input']";
  const TOP_RESULT = "[data-id='MODAL_CONTENT']"
    + " [data-qa='list.item.main']"
    + " [data-qa='list.item.primary']"
  await page.locator(INPUT_FIELD).fill(phoneNumber, { timeout: 90000 });
  await page.getByText('Search results (1)').click();
  await page.locator(TOP_RESULT).click();
}

async function sendTextMessage(page: Page, textMessage: string) {
  console.log("Sending the text message...")
  const CONTAINER = "[data-qa='conversation-compose']"
  const INPUT_FIELD = `${CONTAINER} div[role='textbox'] div`;
  const SEND_BUTTON = `${CONTAINER} [data-qa='send-message'][data-button-disabled='false']`
  await page.locator(INPUT_FIELD).fill(textMessage);
  await page.locator(INPUT_FIELD).press('Enter');
  await page.locator(SEND_BUTTON).click();
  await page.waitForTimeout(1000);
}


//////////////////////////
////    BACKGROUND    ////
//////////////////////////

async function deployAutoDialogeClosers(page: Page, timeout_ms: number = 10000) {
  const tutorialDialogInterval = await closeTutorialDialog(page);
  await page.waitForTimeout(500);

  const noAudioInterval = await closeNoAudioDialog(page);
  await page.waitForTimeout(500);

  const voiceMailInterval = await closeVoiceMailDialog(page);
  await page.waitForTimeout(500);

  // Stop polling after timeout is up
  setTimeout(() => {
    clearInterval(tutorialDialogInterval);
    clearInterval(noAudioInterval);
    clearInterval(voiceMailInterval);
    console.log(`Stopped polling after ${timeout_ms / 1000} seconds.`);
  }, timeout_ms); // 1 minute in milliseconds
}

async function closeTutorialDialog(
  page: Page,
  interval_ms: number = 1000
): Promise<NodeJS.Timeout> {

  const CLOSE_BUTTON = "[data-tour-elem='guide-tooltip'] button.reactour__close";
  const CONFIRM_BUTTON = "[data-id='dialog-container'] [data-qa='button-yes']";

  const intervalId = setInterval(async () => {
    // console.log("Waiting for tutorial..")
    try {
      const TUTORIAL_DIALOG = await page.$(CLOSE_BUTTON);
      if (TUTORIAL_DIALOG) {
        await page.locator(CLOSE_BUTTON).click();
        await page.locator(CONFIRM_BUTTON).click();
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error("An error occurred while trying to close the tutorial:", error);
    }
  }, interval_ms);

  return intervalId;
}

async function closeNoAudioDialog(
  page: Page,
  interval_ms: number = 1000
): Promise<NodeJS.Timeout> {

  const CLOSE_BUTTON = "[data-test-id='MODAL_HEADER_CLOSE_ICON']";

  const intervalId = setInterval(async () => {
    // console.log("Waiting for no audio..")
    const NO_AUDIO_DIALOG = await page.$('[data-qa="select-source"]');
    if (NO_AUDIO_DIALOG) {
      await page.locator(CLOSE_BUTTON).click();
      clearInterval(intervalId);
    }
  }, interval_ms);
  return intervalId;
}

async function closeVoiceMailDialog(
  page: Page,
  interval_ms: number = 1000
): Promise<NodeJS.Timeout> {

  const CLOSE_BUTTON = "[data-test-id='MODAL_HEADER_CLOSE_ICON']";

  const intervalId = setInterval(async () => {
    // console.log("Waiting for voicemail..")
    const VOICE_MAIL_DIALOG = await page.$("[data-qa='upload']");
    if (VOICE_MAIL_DIALOG) {
      await page.locator(CLOSE_BUTTON).click();
      clearInterval(intervalId);
    }
  }, interval_ms);
  return intervalId;
} sendTextMessage