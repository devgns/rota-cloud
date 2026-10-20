import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from 'motion/react'
import { useEffect, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui'
import { coursePath, DEFAULT_COURSE_ID } from '@/courses/registry'

const HEADLINE = ['Toda', 'certificação', 'começa', 'pela', 'primeira', 'camada']
const LAYERS = ['fundamentos', 'segurança', 'redes', 'arquitetura', 'aprovação']

const line: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const word: Variants = {
  hidden: { opacity: 0, y: '0.7em', rotateX: -70, filter: 'blur(8px)' },
  shown: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 170, damping: 18 } },
}

/** Texto de abertura: frase palavra a palavra e uma "camada" que alterna logo abaixo. */
export function RouteHero() {
  const reduce = useReducedMotion()
  const [layer, setLayer] = useState(0)
  useEffect(() => {
    if (reduce) return
    const timer = window.setInterval(() => setLayer((value) => (value + 1) % LAYERS.length), 2200)
    return () => window.clearInterval(timer)
  }, [reduce])

  // Parallax leve do desenho com o ponteiro (só mouse).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  const tx = useTransform(sx, (v) => v * 18)
  const ty = useTransform(sy, (v) => v * 12)
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - box.left) / box.width - 0.5)
    py.set((event.clientY - box.top) / box.height - 0.5)
  }

  return (
    <section className="hero" onPointerMove={onPointerMove} onPointerLeave={() => { px.set(0); py.set(0) }}>
      <div className="hero-copy">
        <motion.p className="hero-kicker" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Rota Cloud · estudos para certificações AWS
        </motion.p>
        <motion.h1 className="hero-title" variants={line} initial={reduce ? 'shown' : 'hidden'} animate="shown" aria-label={`${HEADLINE.join(' ')}.`}>
          {HEADLINE.map((text, index) => (
            <motion.span key={text} className={`hero-word ${index === HEADLINE.length - 1 ? 'hero-word-accent' : ''}`} variants={word} aria-hidden="true">
              {text}
              {index === HEADLINE.length - 1 && <span className="hero-period">.</span>}
              {index === HEADLINE.length - 1 && (
                <motion.span
                  className="hero-underline"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: reduce ? 0 : 1.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p className="hero-layers" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 1.2, duration: 0.5 }}>
          Uma camada de cada vez:{' '}
          <span className="hero-layer-slot">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={LAYERS[layer]}
                className="hero-layer"
                initial={{ opacity: 0, y: '0.6em', filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: '-0.6em', filter: 'blur(4px)' }}
                transition={{ duration: 0.35 }}
              >
                {LAYERS[layer]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.p>
        <motion.div className="mt-8 flex flex-wrap gap-3" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 1.45, duration: 0.45 }}>
          <Link className={buttonClass()} to={coursePath(DEFAULT_COURSE_ID)}>Começar pelo CLF-C02</Link>
          <a className={buttonClass('ghost')} href="#cursos" onClick={(event) => { event.preventDefault(); document.getElementById('cursos')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }) }}>Ver cursos</a>
        </motion.div>
      </div>
      <motion.div className="hero-art" style={{ x: tx, y: ty }} aria-hidden="true">
        <RouteArt reduce={Boolean(reduce)} />
      </motion.div>
    </section>
  )
}

const NODES = [
  { code: 'CLF', x: 92, y: 300, done: true },
  { code: 'AIF', x: 214, y: 210 },
  { code: 'SAA', x: 352, y: 246 },
  { code: 'DVA', x: 470, y: 132 },
  { code: 'PRO', x: 548, y: 46, far: true },
] as const

const START = 'M 18 372 C 40 340, 60 320, 92 300'
const AHEAD = 'M 92 300 C 140 270, 170 220, 214 210 S 300 260, 352 246 S 430 170, 470 132 S 530 70, 548 46'

/** A rota: a parte já percorrida em âmbar, o caminho à frente tracejado. */
function RouteArt({ reduce }: { reduce: boolean }) {
  const draw = (delay: number, duration: number) =>
    reduce ? { initial: false as const } : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { delay, duration, ease: 'easeInOut' as const } }
  return (
    <svg viewBox="0 0 600 400" className="hero-svg">
      <defs>
        <radialGradient id="hero-glow">
          <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[0, 1, 2, 3].map((index) => (
        <motion.ellipse
          key={index}
          cx={300}
          cy={230}
          rx={250 - index * 46}
          ry={140 - index * 26}
          fill="none"
          className="stroke-line"
          strokeWidth={1}
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.08, duration: 0.8 }}
        />
      ))}
      <motion.path d={START} fill="none" className="stroke-amber" strokeWidth={4} strokeLinecap="round" {...draw(0.4, 0.6)} />
      {/* pathLength usa o dasharray; o tracejado é revelado por uma máscara que se desenha. */}
      <mask id="hero-ahead" maskUnits="userSpaceOnUse">
        <motion.path d={AHEAD} fill="none" stroke="white" strokeWidth={10} strokeLinecap="round" {...draw(0.95, 1.6)} />
      </mask>
      <path d={AHEAD} fill="none" className="stroke-ink-soft" strokeWidth={2} strokeDasharray="2 9" strokeLinecap="round" mask="url(#hero-ahead)" />
      {NODES.map((node, index) => {
        const done = 'done' in node
        const far = 'far' in node
        return (
          <motion.g
            key={node.code}
            initial={reduce ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: far ? 0.45 : 1, scale: 1 }}
            transition={{ delay: done ? 0.95 : 1.1 + index * 0.32, type: 'spring', stiffness: 260, damping: 16 }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            {done && (
              <>
                <circle cx={node.x} cy={node.y} r={46} fill="url(#hero-glow)" />
                {!reduce && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill="none"
                    className="stroke-amber"
                    strokeWidth={2}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1.6 }}
                  />
                )}
              </>
            )}
            <circle cx={node.x} cy={node.y} r={done ? 20 : 15} className={done ? 'fill-navy stroke-amber' : 'fill-paper stroke-ink-soft'} strokeWidth={done ? 3 : 1.5} strokeDasharray={done ? undefined : '3 3'} />
            {done ? (
              <path d={`M ${node.x - 7} ${node.y} l 5 5 l 9 -10`} fill="none" stroke="var(--color-paper)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
            <text x={node.x} y={node.y + (done ? 40 : 33)} textAnchor="middle" className="hero-node-label" fontWeight={done ? 700 : 600}>
              {node.code}
            </text>
          </motion.g>
        )
      })}
      <motion.text
        x={26}
        y={392}
        className="hero-node-label hero-start"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        você está aqui
      </motion.text>
    </svg>
  )
}
