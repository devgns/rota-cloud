import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(__dirname, '..')
const names = readdirSync(join(root, 'skills'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)

function frontmatter(path: string) {
  const text = readFileSync(path, 'utf8')
  const block = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1] ?? ''
  return {
    text,
    name: /^name: (.+)$/m.exec(block)?.[1]?.trim(),
    description: /^description: (.+)$/m.exec(block)?.[1]?.trim(),
  }
}

describe('skills do projeto (fonte única em skills/)', () => {
  it('tem as quatro skills combinadas', () => {
    expect(names.sort()).toEqual(['didactic-track', 'exam-research', 'rota-cloud-dev', 'visual-elements'])
  })

  for (const name of names) {
    it(`${name}: fonte válida e ponteiros sincronizados`, () => {
      const source = frontmatter(join(root, 'skills', name, 'SKILL.md'))
      expect(source.name).toBe(name)
      expect(source.description?.length).toBeGreaterThan(40)
      for (const tool of ['.claude', '.agents']) {
        const pointer = frontmatter(join(root, tool, 'skills', name, 'SKILL.md'))
        expect(pointer.name, `${tool}/${name}`).toBe(source.name)
        expect(pointer.description, `${tool}/${name}`).toBe(source.description)
        expect(pointer.text).toContain(`skills/${name}/SKILL.md`)
      }
      expect(readFileSync(join(root, 'AGENTS.md'), 'utf8')).toContain(`skills/${name}/SKILL.md`)
    })

    it(`${name}: caminhos citados existem`, () => {
      const { text } = frontmatter(join(root, 'skills', name, 'SKILL.md'))
      const paths = [...text.matchAll(/`((?:src|docs|scripts|content|data|skills|tests|e2e)\/[^`\s]+)`/g)]
        .map((m) => m[1]!)
        .filter((p) => !/[<>*{}]/.test(p))
      for (const p of paths) expect(existsSync(join(root, p)), p).toBe(true)
    })
  }
})
