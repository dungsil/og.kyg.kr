import type { VercelRequest } from '@vercel/node'
import { extname } from 'path'
import defu from 'defu'
import wrap from 'smartwrap'

export interface Options {
  theme: string,
  extension: string,
  title: string,
  iconify?: string,
  category?: string,
  description?: string,
}

/**
 * 요청에서 옵션을 가져온다.
 * @param req
 */
export function parseOption(req: VercelRequest): Options {
  const path = (req.query.title as string)?.replace(/^\/api/, '')
  const extension = extname(path)
  const pathname = path.replace(extension, '')

  let { theme, category, description, iconify } = req.query

  // title
  const titleList = wrap(pathname, { width: 20, trim: true, breakword: true })
    .split('\n')
    .map((t: string) => t ? `<tspan x="70px" dy="1.2em">${t.trim()}</tspan>` : '')

  let title: string
  if (titleList.length > 2) {
    title = titleList[0] + titleList[1] + '...'
  } else {
    title = titleList.join('')
  }

  // description
  const descriptionList = wrap(description, { width: 70, trim: true, breakword: true })
    .split('\n')
    .map((t: string) => t ? `<tspan x="70px" dy="1.2em">${t.trim()}</tspan>` : '')

  if (descriptionList.length > 3) {
    description = descriptionList[0] + descriptionList[1] + descriptionList[2] + '...'
  } else {
    description = descriptionList.join('')
  }

  const reqOptions: Partial<Options> = {
    theme: theme as string,
    extension,
    title,
    category: category as string,
    description: description as string,
    iconify: iconify as string
  }

  return defu(reqOptions, {
    theme: 'github',
    extension: 'svg',
    title: '',
    category: undefined,
    description: undefined
  })
}

