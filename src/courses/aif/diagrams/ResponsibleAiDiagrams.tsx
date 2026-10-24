import { useState } from 'react'
import { Callout, Choices, DiagramShell, ScenarioQuiz, Svg, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'
import { Meter, Range, pct } from './parts'

/* 19.2 — média global × subgrupos */

type Source = 'sampling' | 'labels' | 'history' | 'proxy' | 'feedback'

const sources: readonly { id: Source; label: string; what: string; fix: string }[] = [
  { id: 'sampling', label: 'Amostragem', what: 'O grupo D tem poucos exemplos: o modelo quase não aprendeu o padrão dele.', fix: 'Coletar dados representativos e medir por subgrupo.' },
  { id: 'labels', label: 'Rotulagem', what: 'Avaliadores aplicaram critérios diferentes aos casos do grupo D.', fix: 'Guia de rotulagem, revisão cruzada e concordância entre avaliadores.' },
  { id: 'history', label: 'Histórico', what: 'Decisões passadas injustas viraram “gabarito” do treino.', fix: 'Questionar o rótulo histórico e envolver pessoas afetadas.' },
  { id: 'proxy', label: 'Proxy', what: 'O CEP, aparentemente neutro, correlaciona-se com o grupo. Remover a coluna sensível não basta.', fix: 'Testar correlações, analisar features e métricas por grupo (ex.: SageMaker Clarify).' },
  { id: 'feedback', label: 'Feedback', what: 'O modelo nega crédito ao grupo D, que então gera menos dados positivos, reforçando a negação.', fix: 'Monitorar em produção e auditar o efeito do próprio modelo.' },
]

const groups = [
  { id: 'A', share: 0.6, base: 0.985 },
  { id: 'B', share: 0.25, base: 0.982 },
  { id: 'C', share: 0.13, base: 0.975 },
  { id: 'D', share: 0.02, base: 0.7 },
]

export function FairnessSubgroupDiagram() {
  const [dShare, setDShare] = useState(2)
  const [source, setSource] = useState<Source>('sampling')
  // Mais exemplos do grupo D melhoram o acerto nele (curva saturante, ilustrativa).
  const dAcc = 0.7 + 0.25 * (1 - Math.exp(-(dShare - 2) / 6))
  const accs = groups.map((g) => (g.id === 'D' ? dAcc : g.base))
  const global = groups.reduce((s, g, i) => s + g.share * accs[i]!, 0)
  const info = sources.find((s) => s.id === source)!
  return (
    <DiagramShell
      label="Acurácia global comparada à acurácia por subgrupo"
      kicker="Fairness"
      title="98% na média, 70% para quem tem pouca voz nos dados"
      lead="O grupo D é 2% da população. Aumente a presença dele no treino e veja a média quase não se mexer — enquanto a vida dele muda."
      limits="Números ilustrativos. Fairness tem várias métricas que podem conflitar entre si; escolher qual priorizar é decisão de negócio, jurídica e ética, não só estatística."
    >
      <div className="mt-3 grid gap-2">
        <Meter label="Acurácia global" value={global} display={pct(global, 1)} tone="plain" />
        {groups.map((g, i) => <Meter key={g.id} label={`Grupo ${g.id} · ${pct(g.share)} dos casos`} value={accs[i]!} display={pct(accs[i]!, 1)} tone={accs[i]! < 0.85 ? 'bad' : accs[i]! < 0.93 ? 'warn' : 'ok'} />)}
      </div>
      <Range label="Exemplos do grupo D no treino (% do dataset)" min={2} max={20} step={1} value={dShare} onChange={setDShare} display={`${dShare}%`} />
      <Choices label="Fonte do viés" options={sources.map((s) => ({ id: s.id, label: s.label }))} value={source} onChange={setSource} />
      <Callout tone={dAcc < 0.85 ? 'bad' : 'ok'} title={`Viés de ${info.label.toLowerCase()}`} live>
        <p className="m-0">{info.what}</p>
        <p className="m-0 mt-1"><strong>Mitigação:</strong> {info.fix}</p>
      </Callout>
    </DiagramShell>
  )
}

/* 19.3 — viés × variância */

export function BiasVarianceDiagram() {
  const [complexity, setComplexity] = useState(5)
  const train = (c: number) => 0.42 * Math.exp(-c / 3) + 0.02
  const test = (c: number) => 0.42 * Math.exp(-c / 3) + 0.06 + 0.0035 * Math.max(0, c - 4) ** 2
  const x = (c: number) => 40 + (c / 15) * 580
  const y = (e: number) => 190 - e * 380
  const path = (f: (c: number) => number) => Array.from({ length: 61 }, (_, i) => i / 4).map((c, i) => `${i ? 'L' : 'M'}${x(c).toFixed(1)} ${y(Math.min(0.48, f(c))).toFixed(1)}`).join(' ')
  const zone = complexity < 3 ? 'under' : complexity > 7 ? 'over' : 'ok'
  return (
    <DiagramShell
      label="Curvas de erro de treino e de teste por complexidade do modelo"
      kicker="Viés × variância"
      title="Simples demais não aprende; complexo demais decora"
      lead="Mova a complexidade do modelo e acompanhe o erro no treino e no teste."
      limits="Curvas idealizadas. Viés estatístico (suposições que erram sistematicamente) é diferente de viés social, embora os dois possam coexistir."
    >
      <div className="diagram-canvas">
        <Svg width={640} height={215} minWidth={440} title="Erro de treino cai sempre; erro de teste cai e depois sobe">
          <rect x={x(0)} y={10} width={x(3) - x(0)} height={180} className="fill-amber-soft" opacity={0.5} />
          <rect x={x(7)} y={10} width={x(15) - x(7)} height={180} className="fill-bad-soft" opacity={0.5} />
          <text x={x(1.5)} y={26} fontSize={10.5} textAnchor="middle" fontWeight={600}>underfit</text>
          <text x={x(11)} y={26} fontSize={10.5} textAnchor="middle" fontWeight={600}>overfit</text>
          <line x1={40} y1={190} x2={620} y2={190} className="stroke-ink-soft" />
          <path d={path(train)} fill="none" className="stroke-navy" strokeWidth={2.5} />
          <path d={path(test)} fill="none" className="stroke-amber" strokeWidth={2.5} />
          <text x={x(14.5)} y={y(train(14.5)) - 6} fontSize={11} textAnchor="end" fontWeight={600}>erro de treino</text>
          <text x={x(14.5)} y={y(Math.min(0.48, test(14.5))) + 14} fontSize={11} textAnchor="end" fontWeight={600}>erro de teste</text>
          <text x={620} y={206} fontSize={10} textAnchor="end" className="dg-soft">complexidade do modelo →</text>
          <g className="dg-move" style={{ transform: `translateX(${x(complexity)}px)` }}>
            <line x1={0} y1={10} x2={0} y2={190} className="stroke-ink" strokeDasharray="3 3" />
          </g>
        </Svg>
      </div>
      <Range label="Complexidade" min={0.5} max={14} step={0.5} value={complexity} onChange={setComplexity} display={`treino ${pct(train(complexity))} · teste ${pct(Math.min(0.48, test(complexity)))}`} />
      <Callout tone={zone === 'ok' ? 'ok' : 'warn'} title={zone === 'under' ? 'Underfitting: alto viés' : zone === 'over' ? 'Overfitting: alta variância' : 'Faixa equilibrada'} live>
        {zone === 'under'
          ? 'Erra muito até no treino: o modelo é simples demais para o padrão. Mais features ou modelo mais expressivo.'
          : zone === 'over'
            ? 'Quase perfeito no treino e pior no teste: decorou ruído. Mais dados, regularização ou modelo mais simples.'
            : 'O erro de teste está perto do mínimo. Confira também em cada subgrupo — a média pode esconder um grupo em overfit ou underfit.'}
      </Callout>
    </DiagramShell>
  )
}

/* 20.4 — supervisão humana */

const steps = [
  { id: 'req', label: 'Pedido' },
  { id: 'ai', label: 'IA propõe' },
  { id: 'rules', label: 'Regras e evidências' },
  { id: 'human', label: 'Pessoa revisa' },
  { id: 'act', label: 'Executa' },
  { id: 'log', label: 'Registra' },
  { id: 'mon', label: 'Monitora' },
] as const

export function HumanOversightDiagram() {
  const [mode, setMode] = useState<'in' | 'on' | 'none'>('in')
  const [volume, setVolume] = useState(40)
  const order = mode === 'in' ? steps : steps.filter((s) => s.id !== 'human')
  const rubber = mode === 'in' && volume > 120
  return (
    <DiagramShell
      label="Fluxo de decisão de alto impacto com human-in-the-loop e human-on-the-loop"
      kicker="Design centrado no humano"
      title="Onde a pessoa entra no fluxo?"
      lead="Compare a revisão antes da ação (in-the-loop) com a supervisão de exceções (on-the-loop) e com nenhuma supervisão."
      limits="A escolha depende do impacto da decisão, do custo do erro e da regulação. O essencial é que a responsabilidade humana não desapareça com a automação."
    >
      <Choices label="Modelo de supervisão" options={[{ id: 'in', label: 'Human-in-the-loop' }, { id: 'on', label: 'Human-on-the-loop' }, { id: 'none', label: 'Sem supervisão' }]} value={mode} onChange={setMode} />
      <div className="diagram-canvas">
        <Svg width={640} height={130} minWidth={520} title="Etapas do fluxo em sequência">
          {order.map((s, i) => {
            const w = 600 / order.length
            const xx = 20 + i * w
            const human = s.id === 'human'
            return (
              <g key={s.id} className="dg-fade">
                <rect x={xx} y={30} width={w - 14} height={46} rx={8} className={human ? (rubber ? 'fill-amber-soft stroke-amber' : 'fill-ok-soft stroke-ok') : 'fill-paper stroke-ink-soft'} strokeWidth={human ? 2.5 : 1.2} />
                {s.label.split(' ').reduce<string[]>((lines, word) => (lines.length && (lines.at(-1)! + ' ' + word).length <= 10 ? [...lines.slice(0, -1), lines.at(-1)! + ' ' + word] : [...lines, word]), []).map((line, j, all) => (
                  <text key={line} x={xx + (w - 14) / 2} y={57 - (all.length - 1) * 6.5 + j * 13} fontSize={10.5} textAnchor="middle" fontWeight={600}>{line}</text>
                ))}
                {i < order.length - 1 && <path d={`M${xx + w - 13} 53 h10`} className="stroke-ink-soft" strokeWidth={1.5} />}
              </g>
            )
          })}
          {mode === 'on' && (
            <g>
              <rect x={240} y={92} width={200} height={30} rx={15} className="fill-ok-soft stroke-ok" strokeWidth={2} />
              <text x={340} y={111} fontSize={11} textAnchor="middle" fontWeight={600}>Pessoa supervisiona e intervém</text>
              <path d="M340 92 V80" className="stroke-ok" strokeDasharray="3 3" />
            </g>
          )}
        </Svg>
      </div>
      {mode === 'in' && <Range label="Casos por revisor por hora" min={10} max={300} step={10} value={volume} onChange={setVolume} display={`${volume}`} />}
      <Callout tone={mode === 'none' ? 'bad' : rubber ? 'warn' : 'ok'} title={mode === 'none' ? 'Ninguém responde pela decisão' : rubber ? 'Revisão de fachada' : mode === 'in' ? 'Pessoa decide antes da ação' : 'Automação com supervisão de exceções'} live>
        {mode === 'none'
          ? 'Para decisões de alto impacto (crédito, saúde, emprego), automação sem contestação nem revisão é inaceitável.'
          : rubber
            ? `${volume} casos por hora é menos de ${Math.round(3600 / volume)} segundos por caso: a revisão vira um clique automático. Revisão precisa ser substantiva, com poder real de recusa.`
            : mode === 'in'
              ? 'A pessoa vê a proposta, as evidências e pode recusar. Adequado para ações sensíveis ou irreversíveis.'
              : 'O sistema executa sozinho; a pessoa monitora métricas e alertas e pode suspender ou corrigir. Adequado para alto volume e menor risco por decisão.'}
      </Callout>
    </DiagramShell>
  )
}

/* 20.1 — transparência ou explicabilidade? */

type Kind = 'transp' | 'explain'

const kindOptions: readonly QuizOption<Kind>[] = [
  { id: 'transp', label: 'Transparência', role: 'revela que há IA, que dados e modelos são usados, limites e responsáveis.' },
  { id: 'explain', label: 'Explicabilidade', role: 'ajuda a entender por que aquela previsão ou resultado saiu.' },
]

const kindScenarios: readonly QuizScenario<Kind>[] = [
  { id: 'e1', prompt: 'O chat avisa: “Você está falando com um assistente de IA; respostas podem conter erros.”', answer: 'transp', why: 'Revela o uso de IA e os limites: transparência.' },
  { id: 'e2', prompt: 'A tela de crédito mostra que renda e histórico de atrasos foram os fatores que mais pesaram na negativa.', answer: 'explain', why: 'Explica por que a decisão saiu: explicabilidade (ex.: atribuição de features).' },
  { id: 'e3', prompt: 'Um Model Card publica propósito, dados de avaliação, limitações e quem é responsável.', answer: 'transp', why: 'Documentação sobre o sistema como um todo: transparência.' },
  { id: 'e4', prompt: 'A resposta do RAG mostra os trechos exatos dos documentos que sustentam cada afirmação.', answer: 'explain', why: 'Mostra a evidência que levou àquela resposta — desde que a citação seja fiel ao que foi realmente usado.' },
]

export function TransparencyQuiz() {
  return (
    <DiagramShell label="Quiz transparência ou explicabilidade" kicker="Duas perguntas diferentes" title="Transparência ou explicabilidade?" lead="Transparência fala do sistema; explicabilidade, de uma decisão.">
      <ScenarioQuiz label="Conceito" scenarios={kindScenarios} options={kindOptions} />
    </DiagramShell>
  )
}

/* 19.1 — características da IA responsável */

type Trait = 'bias' | 'fair' | 'incl' | 'robust' | 'safety' | 'verac'

const traitOptions: readonly QuizOption<Trait>[] = [
  { id: 'bias', label: 'Viés', role: 'resultado sistematicamente desfavorável a um grupo.' },
  { id: 'fair', label: 'Justiça', role: 'pessoas equivalentes recebendo tratamento diferente.' },
  { id: 'incl', label: 'Inclusão', role: 'grupos ou formas de uso que ficaram de fora.' },
  { id: 'robust', label: 'Robustez', role: 'comportamento instável sob entrada ruidosa ou adversária.' },
  { id: 'safety', label: 'Segurança', role: 'saída que pode causar dano.' },
  { id: 'verac', label: 'Veracidade', role: 'afirmação falsa ou sem evidência.' },
]

const traitScenarios: readonly QuizScenario<Trait>[] = [
  { id: 't1', prompt: 'O classificador muda de “aprovado” para “negado” quando o cliente digita o nome com um acento a menos.', answer: 'robust', why: 'Pequena perturbação na entrada mudou a decisão: falta de robustez.' },
  { id: 't2', prompt: 'O assistente de voz entende bem quem fala o português do Sudeste e erra muito com sotaques do Nordeste.', answer: 'incl', why: 'Um público ficou sub-representado nos dados e nos testes: problema de inclusão.' },
  { id: 't3', prompt: 'O resumo jurídico cita com confiança um artigo de lei que não existe.', answer: 'verac', why: 'Afirmação não sustentada por evidência: veracidade (alucinação).' },
  { id: 't4', prompt: 'O modelo de crédito aprova 40% menos pedidos de um bairro, mesmo controlando renda e histórico.', answer: 'bias', why: 'Desvantagem sistemática associada a um grupo (o CEP funciona como proxy): viés.' },
  { id: 't5', prompt: 'O chatbot de uma farmácia sugere aumentar a dose de um remédio controlado.', answer: 'safety', why: 'A saída pode causar dano físico: segurança (safety). Guardrails e escalonamento humano.' },
  { id: 't6', prompt: 'Dois candidatos com o mesmo currículo recebem notas diferentes; a única diferença é o gênero.', answer: 'fair', why: 'Casos equivalentes, tratamento diferente: justiça (fairness).' },
]

export function ResponsibleTraitsQuiz() {
  return (
    <DiagramShell label="Quiz das características de IA responsável" kicker="Domínio 4 · objetivo 4.1" title="Qual característica falhou?" lead="Seis princípios, seis falhas diferentes. Identifique cada uma pelo sintoma.">
      <ScenarioQuiz label="Característica" scenarios={traitScenarios} options={traitOptions} />
    </DiagramShell>
  )
}
