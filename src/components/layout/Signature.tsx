import { motion, useReducedMotion, type Variants } from 'motion/react'
import { AUTHOR, GITHUB } from '@/courses/registry'

const COMMAND = "git log --format='%an' | uniq"
const CHAR_DELAY = 0.035

const typed: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: CHAR_DELAY, delayChildren: 0.3 } },
}
const char: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0 } },
}

/** Versão de uma linha para as páginas internas: discreta, sem animação de digitação. */
export function SignatureLine() {
  return (
    <p className="signature-mini">
      <span aria-hidden="true">~/rota-cloud $ </span>made with <span className="signature-mini-heart" role="img" aria-label="amor">♥</span> by{' '}
      <a href={GITHUB} target="_blank" rel="noreferrer noopener">
        @{AUTHOR}
      </a>
    </p>
  )
}

/** Assinatura do catálogo: um "comando" digitado uma vez quando aparece na tela. */
export function Signature() {
  const reduce = useReducedMotion()
  const outputDelay = reduce ? 0 : 0.3 + COMMAND.length * CHAR_DELAY + 0.25
  return (
    <motion.figure
      className="signature"
      initial={reduce ? 'shown' : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      aria-label={`Feito com amor por ${AUTHOR}`}
    >
      <div className="signature-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <p>~/rota-cloud</p>
      </div>
      <p className="signature-line" aria-hidden="true">
        <span className="signature-prompt">~/rota-cloud $</span>{' '}
        <motion.span variants={typed}>
          {[...COMMAND].map((letter, index) => (
            <motion.span key={index} variants={char}>
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </p>
      <motion.p
        className="signature-line signature-output"
        variants={{ hidden: { opacity: 0, y: 4 }, shown: { opacity: 1, y: 0, transition: { delay: outputDelay, duration: 0.35 } } }}
      >
        made with{' '}
        <motion.span
          className="signature-heart"
          aria-label="amor"
          role="img"
          animate={reduce ? undefined : { scale: [1, 1.25, 1, 1.18, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
        >
          ♥
        </motion.span>{' '}
        by{' '}
        <a href={GITHUB} target="_blank" rel="noreferrer noopener">
          @{AUTHOR}
        </a>
        <span className="signature-caret" aria-hidden="true" />
      </motion.p>
    </motion.figure>
  )
}
