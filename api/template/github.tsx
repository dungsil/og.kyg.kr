import { wrapSvgText } from '../utils'
import type { Options } from '../options'

export default function github(options: Options) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.2" width="1024px" height="512px">
      <style>
      <![CDATA[
          @import "https://cdn.eyesprotocol.io/fonts/pretendard@1.1/pretendard.min.css";
          svg {
              font-family: Pretendard, sans-serif;
              font-weight: 400;
              font-size: 12pt;
              overflow-wrap: break-word;
          }
          .category {
              font-size: 12pt;
              fill: #868e96;
          }
          .title {
              font-weight: 700;
              font-size: 50pt;
              fill: #212529;
          }
          .description {
              font-size: 18pt;
              fill: #495057;
          }
          ]]>
      </style>
      <pattern id="image" x="0" y="0" width="1" height="1">
          <image x="0" y="0" href="${getIcon(options)}" />
      </pattern>
  
      <rect width="1024px" height="1024px" fill="#fff" />
      <text x="70px" y="75pt" class="category">${options.category ?? ''}</text>
      <text x="70px" y="75pt" class="title">${wrapSvgText(options.title, 20)}</text>
  
      <text x="70px" y="220pt" class="description">${wrapSvgText(options.description, 70)}</text>
  
      <circle cx="850px" cy="127pt" r="100" fill="url(#image)" />
  
      <rect x="0" y="502px" width="1024px" height="10px" fill="blue" />
  </svg>`
}

function getIcon (options: Options) {
  const { iconify } = options

  if (iconify) {
    return `https://api.iconify.design/${iconify}.svg?width=200&amp;height=200`
  }

  return ''
}
