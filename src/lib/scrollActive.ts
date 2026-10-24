/**
 * Centraliza o item ativo dentro do contêiner rolável mais próximo (o menu lateral),
 * sem rolar a página inteira como faria scrollIntoView.
 */
export function centerActiveIn(root: HTMLElement | null) {
  const item = root?.querySelector<HTMLElement>('[aria-current="page"]')
  let box = item?.parentElement ?? null
  while (box && !(box.scrollHeight > box.clientHeight && /auto|scroll/.test(getComputedStyle(box).overflowY))) box = box.parentElement
  if (!item || !box) return
  box.scrollTop += item.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight / 2
}
