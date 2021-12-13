import log, { LogLevel } from 'consola'
import wrap from 'smartwrap'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Options, parseOption } from './options'
import { isProduction } from './utils'

// svg
import svgGithub from './template/github'

// 로그 레벨 정의
log.level = isProduction ? LogLevel.Info : LogLevel.Debug

export default (req: VercelRequest, res: VercelResponse) => {
  const options = parseOption(req)

  let template = svgGithub()
    .replaceAll("{{title}}", wrapText(options.title))
    .replaceAll("{{category}}", options.category ?? '')
    .replaceAll("{{description}}", wrapText(options.description, 70))
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

function wrapText(text: string | undefined, width: number = 20): string {
  if (!text) {
    return ''
  }

  return wrap(text, { width, trim: true, breakword: true })
    .split('\n')
    .map((s: string) => `<tspan x="70px" dy="1.2em">${s.trim()}</tspan>`)
}

