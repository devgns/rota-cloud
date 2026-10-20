import { expect, test } from '@playwright/test'

test('catálogo leva ao curso CLF-C02', async ({ page }) => {
  await page.goto('/#/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/primeira camada/i)
  await expect(page.getByText('em breve').first()).toBeVisible()
  await page.getByRole('link', { name: /CLF-C02.*Cloud Practitioner/i }).click()
  await expect(page).toHaveURL(/#\/cursos\/clf-c02$/)
  await expect(page.getByRole('heading', { name: /apostila inteira/i })).toBeVisible()
})

test('endereço antigo redireciona para o curso', async ({ page }) => {
  await page.goto('/#/ler/chapter-05')
  await expect(page).toHaveURL(/#\/cursos\/clf-c02\/ler\/chapter-05$/)
  await expect(page.getByRole('heading', { level: 1, name: /Economia da nuvem/ })).toBeVisible()
})

test('rodapé assina com o GitHub do autor', async ({ page }) => {
  await page.goto('/#/')
  await expect(page.getByRole('link', { name: '@devgns' })).toHaveAttribute('href', 'https://github.com/devgns')
})

test('início sem métrica de acerto inventada', async ({ page }) => {
  await page.goto('/#/cursos/clf-c02')
  await expect(page.getByRole('heading', { name: /apostila inteira/i })).toBeVisible()
  await expect(page.getByText(/ainda não respondeu questões/i)).toBeVisible()
})

test('questão única só revela o gabarito depois do envio', async ({ page }) => {
  await page.goto('/#/cursos/clf-c02/praticar/treino?q=Q01')
  await page.getByRole('button', { name: /começar treino/i }).click()
  await expect(page.getByText(/gabarito/i)).toHaveCount(0)
  await page.getByRole('radio').first().click()
  await page.getByRole('button', { name: /enviar resposta/i }).click()
  await expect(page.getByText(/gabarito/i)).toBeVisible()
})

test('marcar seção muda a cor do botão', async ({ page }) => {
  await page.goto('/#/cursos/clf-c02/ler/chapter-01')
  await page.getByRole('button', { name: 'Marcar seção como estudada' }).first().click()
  const pressed = page.getByRole('button', { name: 'Seção estudada' }).first()
  await expect(pressed).toHaveAttribute('aria-pressed', 'true')
  const background = await pressed.evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(background).not.toBe('rgba(0, 0, 0, 0)')
})

test('trocar de capítulo pelo rodapé volta ao topo', async ({ page }) => {
  await page.goto('/#/cursos/clf-c02/ler/chapter-01')
  await page.waitForSelector('#artigo')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.locator('#artigo').getByRole('link', { name: /2\. O que é computação em nuvem/i }).click()
  await expect(page).toHaveURL(/chapter-02/)
  await page.waitForFunction(() => window.scrollY < 40)
})

test('índice do capítulo rola até a seção', async ({ page, isMobile }) => {
  test.skip(isMobile, 'o índice lateral aparece no desktop')
  await page.goto('/#/cursos/clf-c02/ler/chapter-01')
  await page.getByRole('navigation', { name: 'Seções deste capítulo' }).getByRole('link', { name: '1.1. Método de aprendizagem' }).click()
  await expect(page).toHaveURL(/c01-1-1-metodo-de-aprendizagem/)
  await expect(page.locator('#c01-1-1-metodo-de-aprendizagem').first()).toBeInViewport()
})

test('checkbox do menu conclui e reabre o capítulo', async ({ page, isMobile }) => {
  test.skip(isMobile, 'o menu de capítulos aparece no desktop')
  await page.goto('/#/cursos/clf-c02/ler/chapter-02')
  const box = page.getByRole('checkbox', { name: /capítulo 2 como concluído/i })
  await box.check()
  await expect(box).toBeChecked()
  await expect(page).toHaveURL(/chapter-02/)
  await box.uncheck()
  await expect(box).not.toBeChecked()
})

test('capítulo 23 revela a resposta só ao pedir', async ({ page }) => {
  await page.goto('/#/cursos/clf-c02/ler/chapter-23')
  await expect(page.getByText(/Elasticidade é o ajuste dinâmico/)).toHaveCount(0)
  await page.getByRole('radio', { name: /Elasticidade/ }).click()
  await page.getByRole('button', { name: 'Ver resposta' }).first().click()
  await expect(page.getByText(/Elasticidade é o ajuste dinâmico/)).toBeVisible()
})

test('busca VPC sem acento', async ({ page }) => {
  await page.goto('/#/cursos/clf-c02/busca?q=vpc')
  await expect(page.getByText(/VPC/i).first()).toBeVisible()
})
