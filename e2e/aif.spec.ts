import { expect, test } from '@playwright/test'

test('AIF: catálogo, leitura, diagramas e progresso persistente', async ({ page }, testInfo) => {
  await page.goto('/#/')
  await page.getByRole('link', { name: /AIF-C01.*AI Practitioner/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Da primeira ideia')
  await page.screenshot({ path: testInfo.outputPath('aif-home.png'), fullPage: true })
  await page.goto('/#/cursos/aif-c01/ler/chapter-02')
  await expect(page.locator('article h1')).toContainText('IA, ML, deep learning')
  await expect(page.locator('article svg[role="img"]').first()).toBeVisible()
  await page.getByRole('button', { name: 'Deep learning' }).press('Enter')
  await expect(page.getByRole('status').filter({ hasText: 'redes neurais de muitas camadas' })).toBeVisible()
  await page.locator('.diagram-shell').screenshot({ path: testInfo.outputPath('aif-diagram.png') })
  await page.getByRole('button', { name: 'Marcar como estudado' }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Capítulo concluído' })).toHaveAttribute('aria-pressed', 'true')
  await page.goto('/#/cursos/clf-c02/ler/chapter-02')
  await expect(page.locator('article h1')).toBeVisible()
  await page.goto('/#/cursos/aif-c01/progresso')
  await expect(page.getByText('1/30', { exact: true })).toBeVisible()
})

test('AIF: todas as leituras, sem falhas ou overflow da página', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (let i = 1; i <= 30; i++) {
    await page.goto(`/#/cursos/aif-c01/ler/chapter-${String(i).padStart(2, '0')}`)
    await expect(page.locator('article h1')).toContainText(`${i}.`)
    expect(await page.locator('article .diagram-shell').count()).toBeGreaterThan(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  }
  expect(errors).toEqual([])
})

test('AIF: treino revela explicação, simulado espera finalização, flashcards e busca', async ({ page }) => {
  await page.goto('/#/cursos/aif-c01/praticar/treino')
  await page.getByRole('radio').first().check()
  await expect(page.getByRole('status').filter({ hasText: /Correto|Resposta esperada/ })).toBeVisible()
  await page.goto('/#/cursos/aif-c01/praticar/simulado')
  await page.getByRole('button', { name: 'Começar simulado' }).click()
  await page.getByRole('radio').first().check()
  await expect(page.getByText(/Resposta esperada:/)).toHaveCount(0)
  await page.reload()
  await expect(page.getByText('1 respondidas')).toBeVisible()
  page.once('dialog', (dialog) => void dialog.accept())
  await page.getByRole('button', { name: 'Encerrar e ver resultado' }).click()
  await expect(page.getByRole('heading', { name: /Resultado:/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Questões comentadas' })).toBeVisible()
  await page.goto('/#/cursos/aif-c01/flashcards')
  await page.getByRole('button', { name: 'Revelar resposta' }).click()
  await page.getByRole('button', { name: 'Sei · 7 dias' }).click()
  await page.getByRole('button', { name: 'Buscar', exact: true }).click()
  await expect(page).toHaveURL(/aif-c01\/busca/)
  await page.getByRole('textbox').fill('seguranca')
  await expect(page.getByText('0 resultado(s)', { exact: true })).toHaveCount(0)
})

test('AIF: simulador de métricas e cartões de recuperação respondem ao clique', async ({ page }) => {
  await page.goto('/#/cursos/aif-c01/ler/chapter-06')
  await page.getByRole('button', { name: 'Regra que nunca acusa' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'recall zero' })).toBeVisible()
  await page.goto('/#/cursos/aif-c01/ler/chapter-01')
  await page.getByRole('button', { name: 'Mostrar resposta' }).first().click()
  await expect(page.getByRole('button', { name: 'Ocultar resposta' })).toBeVisible()
})

test('AIF: capítulo 27 corrige na página e guarda as marcações', async ({ page }) => {
  await page.goto('/#/cursos/aif-c01/ler/chapter-27')
  await page.getByRole('radio').first().check()
  await page.reload()
  await expect(page.getByText('1 de 80 marcadas')).toBeVisible()
  await page.getByRole('button', { name: 'Ver resultado' }).click()
  await expect(page.getByRole('heading', { name: /Resultado: \d+ de 80/ })).toBeVisible()
})

test('AIF: formatos sem crédito parcial, fonte e menu ativo', async ({ page }) => {
  await page.goto('/#/cursos/aif-c01/praticar/formatos')
  await page.getByRole('checkbox').first().check()
  await page.getByRole('button', { name: 'Conferir resposta' }).click()
  await expect(page.getByRole('status').filter({ hasText: /sem crédito parcial|Correto/ })).toBeVisible()
  await page.goto('/#/cursos/aif-c01/ler/chapter-14')
  await expect(page.locator('[aria-current="page"]').first()).toContainText('14.')
  await page.getByRole('button', { name: 'A+' }).filter({ visible: true }).click()
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).not.toBe('16px')
  await page.getByRole('button', { name: 'A', exact: true }).filter({ visible: true }).click()
})


test('Leitor igual nos dois cursos: checkbox no menu, índice com seção ativa e fonte', async ({ page }) => {
  const shape = async () => page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label^="Capítulos"]')
    const toc = document.querySelector('nav[aria-label="Seções deste capítulo"]')
    return {
      navFont: nav ? getComputedStyle(nav).fontSize : null,
      tocFont: toc ? getComputedStyle(toc).fontSize : null,
      checkboxes: nav?.querySelectorAll('input.chapter-check').length ?? 0,
      active: nav?.querySelector('[aria-current="page"]')?.textContent ?? '',
      progressBar: Boolean(document.querySelector('.reading-progress')),
    }
  })
  await page.goto('/#/cursos/clf-c02/ler/chapter-02')
  await expect(page.locator('article h1').first()).toBeVisible()
  const clf = await shape()
  await page.goto('/#/cursos/aif-c01/ler/chapter-02')
  await expect(page.locator('article h1').first()).toBeVisible()
  const aif = await shape()
  expect(clf.checkboxes).toBe(26)
  expect(aif.checkboxes).toBe(30)
  expect(aif.navFont).toBe(clf.navFont)
  expect(aif.tocFont).toBe(clf.tocFont)
  expect(clf.active.startsWith('2.')).toBe(true)
  expect(aif.active.startsWith('2.')).toBe(true)
  expect(clf.progressBar && aif.progressBar).toBe(true)
})

test('Páginas iniciais e de prática sem overflow horizontal', async ({ page }) => {
  for (const route of ['/#/', '/#/cursos/clf-c02', '/#/cursos/aif-c01', '/#/cursos/aif-c01/trilhas', '/#/cursos/aif-c01/praticar', '/#/cursos/aif-c01/progresso', '/#/cursos/clf-c02/trilhas']) {
    await page.goto(route)
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), route).toBe(true)
  }
})
