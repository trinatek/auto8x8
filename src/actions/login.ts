// src/actions/login.ts
import { BrowserSession } from "../browser";


export async function login(
  browserSession: BrowserSession,
  user: string,
  password: string
) {
  const page = browserSession.page!;

  // Step 1: Visit user-profile page for the curl to the login page.
  console.log("Logging in...")
  // await page.goto("https://sso.8x8.com/v2/login");
  await page.goto("https://admin.8x8.com/user-profile");

  // Step 2: Submit user.
  console.log("Submitting username...")  
  await page.fill("#loginId", user);
  await page.click("#submitBtn");

  // Step 3: Submit password.
  console.log("Submitting password...")  
  await page.fill("#password", password);
  await page.click("#submitBtn");
}