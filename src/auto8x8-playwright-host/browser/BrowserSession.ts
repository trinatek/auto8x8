// src/browser/BrowserSession.ts
import { chromium, Browser, Page, BrowserContext, LaunchOptions } from 'playwright';


export class BrowserSession {
  public browser: Browser | null = null;
  public context: BrowserContext | null = null;
  public page: Page | null = null;

  private constructor(private headless: boolean = false) {}

  private async initialize(launchOptions: LaunchOptions): Promise<void> {
    this.browser = await chromium.launch({ headless: this.headless, ...launchOptions });
    assertNonNull(this.browser, 'browser');

    this.context = await this.browser.newContext();
    assertNonNull(this.context, 'context');

    this.page = await this.context.newPage();
    assertNonNull(this.page, 'page');
  }

  public static async get(headless: boolean = false, launchOptions: LaunchOptions = {}): Promise<BrowserSession> {
    const session = new BrowserSession(headless);
    await session.initialize(launchOptions);
    return session;
  }

  public async close(): Promise<this> {
    await Promise.allSettled([
      this.page?.close(),
      this.context?.close(),
      this.browser?.close()
    ]);
    return this;
  }
}


/////////////////////////////////
////    CONVINIENCE FUNCS    ////
/////////////////////////////////

export async function getBrowserSession(
  headless: boolean = false,
  launchOptions: LaunchOptions = {}
): Promise<BrowserSession> {
  const browserSession = await BrowserSession.get(headless, launchOptions);
  return browserSession;
}


/////////////////////////////////
////    LOWER ORDER FUNCS    ////
/////////////////////////////////

function assertNonNull(value: any, name: string) {
  if (value === null) {
    throw new Error(`Initialization failed: ${name} is null`);
  }
};