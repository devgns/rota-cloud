import { useState } from 'react'
import { Callout, DiagramShell, ScenarioQuiz, Svg, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'
import { svgButton } from './parts'

type Method = 'prompt' | 'rag' | 'ft' | 'distill' | 'cpt' | 'scratch'

const ladder: readonly { id: Method; label: string; weights: string; helps: string; cost: string }[] = [
  { id: 'prompt', label: 'Prompt / in-context', weights: 'Não muda pesos', helps: 'Orientar tarefa e formato com instruções e exemplos.', cost: 'O contexto vai em toda chamada (tokens).' },
  { id: 'rag', label: 'RAG', weights: 'Não muda pesos', helps: 'Fatos externos, mutáveis e citáveis.', cost: 'Ingestão, índice, recuperação e política de acesso.' },
  { id: 'ft', label: 'Fine-tuning', weights: 'Muda pesos', helps: 'Comportamento, estilo ou domínio consistentes a partir de exemplos rotulados (instruction tuning é um caso).', cost: 'Dados de qualidade, treino, nova avaliação e versão do modelo.' },
  { id: 'distill', label: 'Destilação', weights: 'Treina um modelo aluno', helps: 'Levar parte da capacidade de um professor grande para um aluno menor, mais barato e rápido.', cost: 'Perde qualidade em algum grau; exige avaliação intensiva e licença compatível.' },
  { id: 'cpt', label: 'Continual pretraining', weights: 'Muda pesos', helps: 'Adaptar a base de conhecimento/representação a um domínio com muito texto não rotulado.', cost: 'Volume de dados e compute elevados.' },
  { id: 'scratch', label: 'Pré-treino do zero', weights: 'Cria os pesos', helps: 'FM próprio para requisitos muito específicos.', cost: 'Altíssimo investimento em dados, compute e governança.' },
]

const options: readonly QuizOption<Method | 'ml'>[] = [
  { id: 'prompt', label: 'Prompt + exemplos', role: 'resolve formato e tarefa simples sem treinar nada.' },
  { id: 'rag', label: 'RAG', role: 'traz fatos atuais com fonte, sem mudar pesos.' },
  { id: 'ft', label: 'Fine-tuning', role: 'fixa um comportamento que prompts não sustentaram.' },
  { id: 'distill', label: 'Destilação', role: 'reduz custo/latência treinando um modelo menor.' },
  { id: 'ml', label: 'ML tradicional', role: 'modelo específico para dados tabulares e classes fixas.' },
]

const scenarios: readonly QuizScenario<Method | 'ml'>[] = [
  { id: 'c1', prompt: '“Queremos treinar o modelo com nosso regulamento atualizado todos os dias.”', answer: 'rag', why: 'A intenção real é consultar fatos atuais com origem: RAG com documentos versionados. Treinar diariamente é caro e difícil de auditar.' },
  { id: 'c2', prompt: 'Classificar milhões de registros estruturados em 10 categorias fixas, com rótulos históricos.', answer: 'ml', why: 'Dados tabulares e rótulos suficientes: ML tradicional custa e demora muito menos que um FM enorme.' },
  { id: 'c3', prompt: 'A resposta precisa vir sempre em um formato específico e estável.', answer: 'prompt', why: 'Comece com instrução, poucos exemplos e validação; ajuste o modelo só se a avaliação mostrar necessidade.' },
  { id: 'c4', prompt: 'Com bons exemplos, prompts longos ainda não mantêm o tom e a estrutura dos pareceres em volume alto.', answer: 'ft', why: 'Mudança de comportamento comprovada e consistente: aqui o fine-tuning se justifica.' },
  { id: 'c5', prompt: 'Um modelo grande atende bem uma tarefa estreita, mas o custo por chamada inviabiliza a escala.', answer: 'distill', why: 'Destilar para um aluno menor pode preservar a capacidade útil nessa tarefa, com menor custo e latência — medindo a perda.' },
]

export function CustomizationLadderDiagram() {
  const [active, setActive] = useState<Method>('rag')
  const item = ladder.find((m) => m.id === active)!
  return (
    <DiagramShell
      label="Escada de customização de foundation models por custo e complexidade"
      kicker="Customização"
      title="Suba a escada só até o degrau que resolve"
      lead="Cada degrau custa mais e é mais difícil de manter. Clique para ver o que muda e quando vale a pena."
      limits="Ordem aproximada; as técnicas podem ser combinadas, e nem toda família de modelos ou serviço oferece todas. Custo de implantação e custo por inferência são dimensões diferentes."
    >
      <div className="diagram-canvas">
        <Svg width={640} height={250} minWidth={480} title="Seis degraus do mais simples ao mais caro">
          <line x1={20} y1={236} x2={626} y2={236} className="stroke-ink-soft" />
          <text x={626} y={250} fontSize={10} textAnchor="end" className="dg-soft">custo e complexidade →</text>
          {ladder.map((m, i) => {
            const h = 40 + i * 36
            const x = 20 + i * 101
            const on = m.id === active
            const changes = m.weights !== 'Não muda pesos'
            return (
              <g key={m.id} {...svgButton(m.label, () => setActive(m.id), on)}>
                <rect x={x} y={236 - h} width={97} height={h} rx={6} className={`dg-fade ${on ? 'fill-amber-soft stroke-amber' : changes ? 'fill-navy-wash stroke-navy' : 'fill-ok-soft stroke-ok'}`} strokeWidth={on ? 2.5 : 1.2} />
                <text x={x + 48} y={236 - h + 16} textAnchor="middle" fontSize={10.5} fontWeight={700}>{m.label.split(' ')[0]}</text>
                <text x={x + 48} y={236 - h + 29} textAnchor="middle" fontSize={9.5} className="dg-soft">{m.label.split(' ').slice(1).join(' ')}</text>
                <text x={x + 48} y={236 - h - 6} textAnchor="middle" fontSize={9.5}>{changes ? '● muda pesos' : '○ sem pesos'}</text>
              </g>
            )
          })}
        </Svg>
      </div>
      <Callout tone="focus" title={`${item.label} · ${item.weights}`} live>
        <p className="m-0"><strong>Ajuda quando:</strong> {item.helps}</p>
        <p className="m-0 mt-1"><strong>Custo:</strong> {item.cost}</p>
      </Callout>
      <p className="mt-4 mb-0 text-sm font-semibold">Diagnóstico da seção 16.5: qual degrau cada pedido realmente pede?</p>
      <ScenarioQuiz label="Abordagem" scenarios={scenarios} options={options} />
    </DiagramShell>
  )
}
