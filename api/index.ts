import { URL } from 'url'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parse as parseQueryString } from 'querystring'
import type { IncomingMessage, ServerResponse } from 'http'

import { getScreenshot } from './libs/puppeteer'
import makeHTML from './libs/make-html'

/**
 * @param {string} icon Simple icon 코드
 * @param {string} 표시할 문자열
 */
export interface RequestOptions {
  icons?: string[] | string
  emojis?: string[] | string
  pattern?: string
  background?: string
  text: string
}

export default async function handler (req: IncomingMessage, res: ServerResponse): Promise<void> {
  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const options = parse(req)
    const html = makeHTML(options)

    const screenshot = await getScreenshot(html)
    res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000')

    res.end(screenshot)
  } catch (e) {
    const noContent = readFileSync(join(__dirname, '/static/no-content.png')).toString('utf-8')
    res.end(noContent)
  }
}

function parse (req: IncomingMessage): RequestOptions {
  const url = new URL(req.url || '/', `https://${req.headers.host}/`)
  const query = parseQueryString(url.search.substr(1))
  const { icons, emojis } = query
  let { pattern, text, background } = query

  if (text == null) {
    throw new Error('Text is null')
  }

  if (Array.isArray(text)) {
    text = text[0]
  }

  if (Array.isArray(pattern)) {
    pattern = pattern[0]
  }

  if (Array.isArray(background)) {
    background = background[0]
  }

  return {
    icons,
    emojis,
    pattern,
    background,
    text
  }
}
