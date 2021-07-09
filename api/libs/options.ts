import chrome from 'chrome-aws-lambda'

export interface Options {
  args: string[];
  executablePath: string;
  headless: boolean;
}

export async function getOptions (): Promise<Options> {
  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  }
}
