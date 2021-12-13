import log, { LogLevel } from 'consola'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Options, parseOption } from './options'
import { isProduction } from './utils'
import { readFileSync } from 'fs'
import { join } from 'path'

// 로그 레벨 정의
log.level = isProduction ? LogLevel.Info : LogLevel.Debug

export default (req: VercelRequest, res: VercelResponse) => {
  const options = parseOption(req)

  let template = getTemplate(options)
    .replaceAll("{{title}}", options.title)
    .replaceAll("{{category}}", options.category ?? '')
    .replaceAll("{{description}}", options.description ?? '')
    .replaceAll('{{border_color}}', '#3178C6')
    .replaceAll(
      "{{image_url}}",
      options.iconify ? `https://api.iconify.design/${options.iconify}.svg?width=200&amp;height=200` : ''
    )

  switch (options.extension) {
    case ".svg":
      res.end(template)
      break
  }
}

function getTemplate(options: Options): string {
  return readFileSync(join(__dirname, './template', `${options.theme}.svg`)).toString('utf-8')
}
