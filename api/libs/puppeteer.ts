import core from 'puppeteer-core'
import type { Page } from 'puppeteer-core'
import { getOptions } from './options'
let _page: Page | null

async function getPage (): Promise<Page> {
  if (_page) {
    return _page
  }
  const options = await getOptions()
  const browser = await core.launch(options)
  _page = await browser.newPage()
  return _page
}

export async function getScreenshot (html: string): Promise<Buffer | string | void> {
  const page = await getPage()
  await page.setViewport({ width: 1200, height: 627 })
  await page.setContent(html)

  return await page.screenshot({ type: 'png' })
}
