import { useEffect, useRef, useState } from 'react'

/**
 * Acompanha a leitura de #artigo: fração lida (barra do topo) e a seção visível (índice lateral).
 * `onProgress` recebe os mesmos dados para quem quiser persistir; é chamado com folga de 800 ms.
 */
export function useReadingSpy(key: string | undefined, initialSection?: string, onProgress?: (passed: number, sectionId: string | undefined) => void) {
  const [active, setActive] = useState<string | undefined>(initialSection)
  const [ratio, setRatio] = useState(0)
  const callback = useRef(onProgress)
  callback.current = onProgress
  const lastPersist = useRef(0)

  useEffect(() => {
    if (!key) return undefined
    let frame = 0
    const onScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const article = document.getElementById('artigo')
        if (!article) return
        const total = Math.max(article.offsetHeight - window.innerHeight, 1)
        const passed = Math.min(1, Math.max(0, -article.getBoundingClientRect().top / total))
        setRatio(passed)
        const nodes = [...article.querySelectorAll('section[id]')]
        const current = nodes.find((node) => {
          const top = node.getBoundingClientRect().top
          return top >= 0 && top < 180
        }) ?? [...nodes].reverse().find((node) => node.getBoundingClientRect().top < 120)
        if (current?.id) setActive(current.id)
        const now = Date.now()
        if (now - lastPersist.current < 800) return
        lastPersist.current = now
        callback.current?.(passed, current?.id)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [key])

  return { active, ratio }
}
