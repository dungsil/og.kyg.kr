import log, { LogLevel } from 'consola'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parseOption } from './options'
import { isProduction } from './utils'

// svg
import svgGithub from './template/github'

// 로그 레벨 정의
log.level = isProduction ? LogLevel.Info : LogLevel.Debug

export default (req: VercelRequest, res: VercelResponse) => {
  const options = parseOption(req)

  let svg = svgGithub(options)

  switch (options.extension) {
    case ".svg":
      res.end(svg)
      break
  }
}
