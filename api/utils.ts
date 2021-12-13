import wrap from 'smartwrap'

export const isProduction = process.env.NODE_ENV === 'production'


export function wrapSvgText(text: string = '', width: number): string {
  return wrap(text, { width, trim: true, wordbreak: true })
    .split('\n')
    .map((s: string) => `<tspan x="70px" dy="1.2em">${s.trim()}</tspan>`)
}
