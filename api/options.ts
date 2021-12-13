import type { VercelRequest } from '@vercel/node'
import { extname } from 'path'
import defu from 'defu'

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

  const reqOptions: Partial<Options> = {
    theme: theme as string,
    extension,
    title: pathname,
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

