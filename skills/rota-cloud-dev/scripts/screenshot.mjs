// Captura telas do Rota Cloud para conferência visual.
// Uso (com `npm run dev -- --port 5199` rodando):
//   node skills/rota-cloud-dev/scripts/screenshot.mjs <saida> <rota> [<rota>...]
// Variáveis: W=largura (padrão 1280), DARK=1 (tema escuro), BASE=http://127.0.0.1:5199, SHELLS=1 (recorta cada .diagram-shell)
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const [out, ...routes] = process.argv.slice(2)
if (!out || routes.length === 0) {
  console.error('uso: node skills/rota-cloud-dev/scripts/screenshot.mjs <pasta-de-saida> <rota> [...rotas]')
  process.exit(1)
}
mkdirSync(out, { recursive: true })
const width = Number(process.env.W ?? 1280)
const base = process.env.BASE ?? 'http://127.0.0.1:5199'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: process.env.DARK ? 'dark' : 'light' })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
for (const route of routes) {
  await page.goto(`${base}/#/${route.replace(/^\/?#?\/?/, '')}`)
  await page.waitForTimeout(700)
  const name = route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'catalogo'
  const suffix = `${width}${process.env.DARK ? '-dark' : ''}`
  if (process.env.SHELLS) {
    const shells = page.locator('.diagram-shell')
    const n = await shells.count()
    for (let i = 0; i < n; i++) await shells.nth(i).screenshot({ path: `${out}/${name}-${i}-${suffix}.png` })
  } else {
    await page.screenshot({ path: `${out}/${name}-${suffix}.png`, fullPage: true })
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  console.log(route, overflow ? 'OVERFLOW HORIZONTAL' : 'ok')
}
console.log('erros de página:', errors.length ? errors : 'nenhum')
await browser.close()
