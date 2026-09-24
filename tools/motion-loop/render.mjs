// node render.mjs <from> <to> [preview]  -> frames/f0000.png ...
import { chromium } from 'file:///C:/Users/apirr/node_modules/playwright/index.mjs'
const [from = '0', to = '240', preview] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
p.on('pageerror', (e) => console.log('pageerror', e.message))
await p.goto('file:///C:/Users/apirr/AppData/Local/Temp/august-qa/anim/index.html', { waitUntil: 'networkidle' })
await p.evaluate(() => window.ready)
const canvas = await p.$('#c')
const frames = preview ? preview.split(',').map(Number) : Array.from({ length: +to - +from }, (_, i) => +from + i)
for (const f of frames) {
  await p.evaluate((f) => window.renderFrame(f), f)
  await canvas.screenshot({ path: `C:/Users/apirr/AppData/Local/Temp/august-qa/anim/frames/f${String(f).padStart(4, '0')}.png` })
}
console.log('done', frames.length)
await b.close()
