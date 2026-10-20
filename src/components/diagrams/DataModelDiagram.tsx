import { useState } from 'react'
import { Choices, DiagramShell, type Tone } from './kit'

type QueryId = 'join' | 'key' | 'adhoc'

interface Table {
  name: string
  cols: readonly string[]
  rows: readonly { id: string; cells: readonly string[] }[]
}

const relational: readonly Table[] = [
  { name: 'users', cols: ['id', 'nome'], rows: [{ id: 'u1', cells: ['1', 'Ana'] }, { id: 'u2', cells: ['2', 'Caio'] }] },
  { name: 'subscriptions', cols: ['id', 'user_id', 'plano'], rows: [{ id: 's1', cells: ['10', '1', 'Pro'] }, { id: 's2', cells: ['11', '2', 'Básico'] }] },
  {
    name: 'payments',
    cols: ['id', 'sub_id', 'valor'],
    rows: [
      { id: 'p1', cells: ['100', '10', '90'] },
      { id: 'p2', cells: ['101', '11', '30'] },
      { id: 'p3', cells: ['102', '10', '90'] },
    ],
  },
]

const dynamo: Table = {
  name: 'eventos (DynamoDB)',
  cols: ['tenantId (partição)', 'ts (ordenação)', 'atributos'],
  rows: [
    { id: 'd1', cells: ['t-42', '10:01', '{tipo: login}'] },
    { id: 'd2', cells: ['t-42', '10:07', '{tipo: compra, valor: 90}'] },
    { id: 'd3', cells: ['t-42', '10:15', '{tipo: logout}'] },
    { id: 'd4', cells: ['t-77', '10:02', '{tipo: login, device: ios}'] },
    { id: 'd5', cells: ['t-77', '10:20', '{tipo: compra}'] },
  ],
}

interface Query {
  id: QueryId
  label: string
  sql: string
  relRows: readonly string[]
  dynRows: readonly string[]
  rel: { tone: Tone; text: string }
  dyn: { tone: Tone; text: string }
}

const queries: readonly Query[] = [
  {
    id: 'join',
    label: 'Pagamentos da Ana com o plano',
    sql: 'JOIN users → subscriptions → payments',
    relRows: ['u1', 's1', 'p1', 'p3'],
    dynRows: [],
    rel: { tone: 'ok', text: 'Natural: as relações e o JOIN existem para isso, com transação ACID.' },
    dyn: { tone: 'warn', text: 'Sem JOIN. Só funciona bem se esse acesso foi modelado antes, com os dados já agrupados por chave.' },
  },
  {
    id: 'key',
    label: 'Eventos do tenant t-42 entre 10:00 e 10:10',
    sql: 'Query: tenantId = t-42 AND ts BETWEEN 10:00 AND 10:10',
    relRows: [],
    dynRows: ['d1', 'd2'],
    rel: { tone: 'plain', text: 'Também responde, com índice. A diferença aparece em escala muito alta e carga variável.' },
    dyn: { tone: 'ok', text: 'Acesso por chave de partição + intervalo da ordenação: latência baixa e previsível em qualquer volume, sem servidor de banco para gerir.' },
  },
  {
    id: 'adhoc',
    label: 'Total pago por plano (pergunta nova)',
    sql: 'SELECT plano, SUM(valor) … GROUP BY plano',
    relRows: ['s1', 's2', 'p1', 'p2', 'p3'],
    dynRows: ['d1', 'd2', 'd3', 'd4', 'd5'],
    rel: { tone: 'ok', text: 'SQL ad hoc é o forte do relacional. Em terabytes de histórico, a resposta vira Redshift ou Athena.' },
    dyn: { tone: 'bad', text: 'Pergunta não modelada vira Scan: lê a tabela inteira. Caro e lento — não é o uso típico.' },
  },
]

function TableView({ table, hot }: { table: Table; hot: readonly string[] }) {
  return (
    <table className="w-full border-collapse text-xs">
      <caption className="pb-1 text-left font-mono text-xs font-semibold">{table.name}</caption>
      <thead>
        <tr>
          {table.cols.map((col) => (
            <th key={col} className="border-b border-line px-1.5 py-1 text-left font-semibold text-ink-soft">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row) => (
          <tr key={row.id} className={`transition-colors ${hot.includes(row.id) ? 'bg-navy-wash font-semibold' : ''}`}>
            {row.cells.map((cell, i) => (
              <td key={i} className="border-b border-line px-1.5 py-1 font-mono">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const verdictClass: Record<Tone, string> = {
  ok: 'border-ok bg-ok-soft',
  warn: 'border-amber bg-amber-soft',
  bad: 'border-bad bg-bad-soft',
  plain: 'border-line',
  focus: 'border-navy bg-navy-wash',
  dim: 'border-line',
}

export function DataModelDiagram() {
  const [queryId, setQueryId] = useState<QueryId>('join')
  const query = queries.find((item) => item.id === queryId) ?? queries[0]!

  return (
    <DiagramShell
      label="Os mesmos dados em modelo relacional e em DynamoDB, com consultas diferentes"
      kicker="Bancos de dados"
      title="A pergunta que você faz escolhe o modelo"
      lead="À esquerda, tabelas relacionadas; à direita, itens agrupados por chave. Troque a consulta e veja quem responde com naturalidade."
      limits="Dados mínimos para caber na tela. NoSQL também tem transações e SQL também escala: o que muda é o custo de modelagem e o padrão de acesso. Índices secundários do DynamoDB ampliam as chaves de consulta."
    >
      <Choices label="Consulta" options={queries} value={query.id} onChange={setQueryId} />
      <p className="m-0 mt-1 font-mono text-xs text-ink-soft">{query.sql}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-line p-2">
          <p className="m-0 text-sm font-semibold">Relacional · RDS/Aurora</p>
          <div className="mt-2 grid gap-2">
            {relational.map((table) => (
              <TableView key={table.name} table={table} hot={query.relRows} />
            ))}
          </div>
          <p className={`m-0 mt-2 rounded-md border px-2 py-1.5 text-sm ${verdictClass[query.rel.tone]}`}>{query.rel.text}</p>
        </div>
        <div className="rounded-lg border border-line p-2">
          <p className="m-0 text-sm font-semibold">Chave-valor · DynamoDB</p>
          <div className="mt-2">
            <TableView table={dynamo} hot={query.dynRows} />
          </div>
          <p className={`m-0 mt-2 rounded-md border px-2 py-1.5 text-sm ${verdictClass[query.dyn.tone]}`} role="status">
            {query.dyn.text}
          </p>
        </div>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
        Outros padrões:
        <span className="dg-chip">grafo → Neptune</span>
        <span className="dg-chip">documento JSON → DocumentDB</span>
        <span className="dg-chip">leitura repetida → ElastiCache</span>
        <span className="dg-chip">analytics → Redshift/Athena</span>
      </p>
    </DiagramShell>
  )
}
