// noinspection CssMissingComma

import { readFileSync } from 'fs'
import { join } from 'path'
import twemoji from 'twemoji'
import * as simpleIcons from 'simple-icons'
import type { RequestOptions } from '../index'

export default function (options: RequestOptions): string {
  return getTemplate(options)
}

const font = readFileSync(join(__dirname, '../static/Pretendard-Bold.woff2')).toString('base64')
const fontFace = readFileSync(join(__dirname, '../static/template/template.font-face.css'))
  .toString('utf-8')
  .replace(/{{\s+?font\s+?}}/g, font)

/**
 * HTML 템플릿에 데이터를 추가한다.
 *
 * @param options
 */
function getTemplate (options: RequestOptions): string {
  const icons = getIcons(options) ?? ['']

  return readFileSync(join(__dirname, '../static/template/template.html'))
    .toString('utf-8')
    .replace(/{{\s+?pattern\s+?}}/g, escapeHTML(options.pattern ?? ''))
    .replace(/{{\s+?background\s+?}}/g, options.background ?? '#ffffff')
    .replace(/{{\s+?color\s+?}}/g, options.color ?? '#343a40')
    .replace(/{{\s+?text\s+?}}/g, escapeHTML(options.text))
    .replace(/{{\s+?style\s+?}}/g, getCSSTemplate())
    .replace(/{{\s+?icon\s+?}}/g, icons.join('<span class="icon plus">+</span>'))
}

/**
 * CSS 템플릿
 */
function getCSSTemplate (): string {
  const css = readFileSync(join(__dirname, '../static/template/template.css'))
    .toString('utf-8')

  return `<style>
          ${fontFace}
          ${css}
          </style>`
}

/**
 * 아이콘을 가져오는 메소드
 *
 * @param options
 */
function getIcons (options: RequestOptions): string[] | undefined {
  if (!options.icons && !options.emojis) {
    return
  }

  const list: string[] = []

  if (Array.isArray(options.icons)) {
    for (const icon of options.icons) {
      list.push(getSimpleIcons(icon))
    }
  } else if (options.icons) {
    list.push(getSimpleIcons(options.icons as string))
  }

  if (Array.isArray(options.emojis)) {
    for (const emoji of options.emojis) {
      list.push(twemoji.parse(emoji, { folder: 'svg', ext: '.svg' }))
    }
  } else if (options.emojis) {
    list.push(twemoji.parse(options.emojis as string, { folder: 'svg', ext: '.svg' }))
  }

  return list
}

function getSimpleIcons (icon: string): string {
  icon = icon.replace(/\./g, 'dot') // https://github.com/simple-icons/simple-icons/pull/5611
  const simpleIcon = simpleIcons[icon]

  if (!simpleIcon) {
    return ''
  }

  const coloredIcon = simpleIcon.svg.replace(/<(path|g)/g, `<$1 fill="#${simpleIcon.hex}"`)

  return `<span class="icon">${coloredIcon}</span>`
}

/**
 * 입력받은 텍스트 escape
 *
 * @param text
 */
function escapeHTML (text: string): string {
  const escapedHTML = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/ /g, '&nbsp;')
    .replace(/"/g, '&quot;')

  return twemoji.parse(escapedHTML, { folder: 'svg', ext: '.svg' })
}
