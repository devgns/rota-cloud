/** Independent AIF-C01 reader. Does not import the CLF-C02 corpus or progress. */
import { useEffect, useMemo, useState } from 'react'
import { Bookmark, Download, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import curriculumJson from '../../../data/CURRICULO_AIF-C01.json'
import flashcardBank from '../../../data/FLASHCARDS_AIF-C01_120.json'
import source from '../../../content/Apostila_AWS_AI_Practitioner_AIF-C01_Completa.md?raw'
import { coursePath } from '../registry'
import { ChapterFooter } from '@/components/reader/ChapterFooter'
import { ChapterNav } from '@/components/reader/ChapterNav'
import { ReaderShell } from '@/components/reader/ReaderShell'
import { SectionToc } from '@/components/reader/SectionToc'
import { useReadingSpy } from '@/components/reader/useReadingSpy'
import { FlipCard } from '@/components/flashcards/FlipCard'
import { AifChapterBody } from './AifChapter'
import { splitChapter } from './sections'
import { ExamBlueprintDiagram } from './diagrams/ExamBlueprintDiagram'
import { Meter } from './diagrams/parts'
import { RouteMap } from '@/components/course/RouteMap'
import { correctText, grade, itemById } from './items'
import { ItemView } from './ItemView'
import { Drill, ExamScreen, PracticeHub } from './PracticeScreens'
import { AifProgressContext, blank, useAifProgressState, type Progress, type Update } from './progress'

const p=(path='') => coursePath('aif-c01',path)
const modules=curriculumJson.modules
const CARDS=flashcardBank.flashcards as Flashcard[]

type Flashcard={id:string;front:string;back:string}
type Chapter={id:string;number:number;title:string;markdown:string;plain:string;sections:{id:string;title:string}[]}

function chaptersOf(text:string):Chapter[]{
  const matches=[...text.matchAll(/^# (\d{1,2})\. (.+)$/gm)]
  return matches.map((match,index)=>{
    const from=match.index ?? 0;const to=matches[index+1]?.index ?? text.length
    const markdown=text.slice(from,to).trim()
    const number=Number(match[1]);const id=`chapter-${String(number).padStart(2,'0')}`
    const sections=splitChapter(markdown,number).sections.map(({id,title})=>({id,title}))
    return {id,number,title:match[2] ?? '',markdown,plain:markdown.toLowerCase(),sections}
  })
}
const chapters=chaptersOf(source)
const chapterById=new Map(chapters.map((ch)=>[ch.id,ch]))

const navModules=modules.map(m=>({id:m.id,title:m.title,chapters:m.chapter_ids.flatMap(id=>{const ch=chapterById.get(id);return ch?[{id,number:ch.number,title:ch.title}]:[]})}))

function ChapterLinks({progress,update,activeId}:{progress:Progress;update:Update;activeId?:string}){
  const toggle=(id:string)=>update(v=>({...v,completed:v.completed.includes(id)?v.completed.filter(c=>c!==id):[...v.completed,id]}))
  return <ChapterNav label="Capítulos do AIF-C01" modules={navModules} completed={progress.completed} onToggle={toggle} activeId={activeId} hrefFor={id=>p(`/ler/${id}`)}/>
}

function StudyHome({progress}:{progress:Progress}){
  const done=progress.completed.length
  const next=chapters.find(ch=>!progress.completed.includes(ch.id)) ?? chapters.at(-1)!
  const latest=progress.attempts.at(-1)
  const cardsDue=CARDS.filter(card=>!progress.reviews[card.id]||progress.reviews[card.id]!.due.slice(0,10)<=new Date().toISOString().slice(0,10)).length
  return <div className="mx-auto max-w-6xl px-4 py-10">
    <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-amber)]">AWS Certified AI Practitioner · AIF-C01</p>
    <h1 className="mt-2 max-w-4xl font-serif text-4xl leading-tight">Da primeira ideia de inteligência artificial a uma aplicação segura e mensurável.</h1>
    <p className="mt-4 max-w-3xl text-[var(--color-ink-soft)]">Uma sequência que explica os porquês: dados, machine learning, modelos de base, prompts, RAG, agentes, ferramentas, avaliação, responsabilidade e governança. Base: guia oficial AIF-C01, revisão 1.1.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <Link className="btn-primary rounded-lg bg-[var(--color-navy)] px-5 py-2.5 font-semibold text-white" to={p(`/ler/${progress.lastChapter || next.id}`)}>{done?'Continuar estudo':'Começar o curso'}</Link>
      <Link className="choice" to={p('/trilhas')}>Explorar trilha</Link>
      <Link className="choice" to={p('/praticar')}>Praticar questões</Link>
    </div>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-[var(--color-line)] p-5"><p className="text-sm text-[var(--color-ink-soft)]">Capítulos estudados</p><p className="mt-1 font-serif text-3xl">{done} / 30</p><div className="mt-3 h-2 rounded-full bg-[var(--color-line)]"><div className="h-full rounded-full bg-[var(--color-amber)]" style={{width:`${done/30*100}%`}}/></div></div>
      <div className="rounded-2xl border border-[var(--color-line)] p-5"><p className="text-sm text-[var(--color-ink-soft)]">Prática autoral</p><p className="mt-1 font-serif text-3xl">80 questões</p><p className="text-sm text-[var(--color-ink-soft)]">{latest?`Última sessão: ${latest.correct}/${latest.total}`:'Sem tentativas finalizadas'}</p></div>
      <div className="rounded-2xl border border-[var(--color-line)] p-5"><p className="text-sm text-[var(--color-ink-soft)]">Flashcards para rever</p><p className="mt-1 font-serif text-3xl">{cardsDue}</p><p className="text-sm text-[var(--color-ink-soft)]">120 cartões, revisão espaçada</p></div>
    </div>
    <h2 className="mb-2 mt-10 font-serif text-2xl">Sua trilha</h2>
    <p className="m-0 text-sm text-[var(--color-ink-soft)]">Cada estação é um módulo; o anel âmbar enche conforme você conclui capítulos. Clique numa estação para abrir.</p>
    <div className="max-w-4xl"><RouteMap courseId="aif-c01" modules={modules} completed={progress.completed}/></div>
    <ExamBlueprintDiagram/>
    <h2 className="mb-4 mt-10 font-serif text-2xl">A rota do conhecimento</h2>
    <div className="grid gap-4 md:grid-cols-2">{modules.map((m,index)=>{
      const n=m.chapter_ids.filter(id=>progress.completed.includes(id)).length
      return <Link key={m.id} to={p(`/ler/${m.chapter_ids[0]}`)} className="rounded-2xl border border-[var(--color-line)] p-5 transition hover:border-[var(--color-amber)]">
        <p className="text-xs uppercase tracking-wide text-[var(--color-amber)]">Etapa {index+1}</p>
        <h3 className="mt-2 font-semibold">{m.title}</h3>
        <div className="mt-3"><Meter label={<span className="font-normal text-[var(--color-ink-soft)]">{n} de {m.chapter_ids.length} capítulos concluídos</span>} value={n/m.chapter_ids.length} tone={n===m.chapter_ids.length?'ok':'warn'}/></div>
      </Link>
    })}</div>
    <p className="mt-6 text-sm text-[var(--color-ink-soft)]">Material independente de preparação, não afiliado à AWS. Os exercícios não reproduzem questões reais, e o percentual de acertos não equivale à pontuação oficial.</p>
  </div>
}

function Reader({chapter,progress,update}:{chapter:Chapter;progress:Progress;update:Update}){
  const previous=chapters[chapter.number-2]
  const next=chapters[chapter.number]
  const module=modules.find(m=>m.chapter_ids.includes(chapter.id))
  const {active,ratio}=useReadingSpy(chapter.id)
  useEffect(()=>{update(p=>({...p,lastChapter:chapter.id}))},[chapter.id,update])
  const done=progress.completed.includes(chapter.id)
  const marked=progress.bookmarks.includes(chapter.id)
  const toggle=()=>update(p=>({...p,completed:done?p.completed.filter(id=>id!==chapter.id):[...p.completed,chapter.id]}))
  const bookmark=()=>update(p=>({...p,bookmarks:marked?p.bookmarks.filter(id=>id!==chapter.id):[...p.bookmarks,chapter.id]}))
  const sections=chapter.number===27?[{id:'c27-folha',title:'Parte A — responda aqui'}]:chapter.sections
  return <ReaderShell
    ratio={ratio}
    context={<>
      <span>{module?.title} · capítulo {chapter.number}</span>
      <button type="button" className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-[var(--color-amber-soft)]" aria-pressed={marked} aria-label={marked?'Remover dos favoritos':'Favoritar capítulo'} onClick={bookmark}><Bookmark className="h-4 w-4" fill={marked?'currentColor':'none'}/> {marked?'Favorito':'Favoritar'}</button>
    </>}
    nav={()=><ChapterLinks progress={progress} update={update} activeId={chapter.id}/>}
    toc={onPick=><SectionToc sections={sections} active={active} hrefFor={id=>p(`/ler/${chapter.id}/${id}`)} onPick={onPick}/>}
  >
    <AifChapterBody markdown={chapter.markdown} number={chapter.number}/>
    <ChapterFooter
      done={done}
      onToggle={toggle}
      previous={previous&&{href:p(`/ler/${previous.id}`),label:`${previous.number}. ${previous.title}`}}
      next={next?{href:p(`/ler/${next.id}`),label:`${next.number}. ${next.title}`}:{href:p('/praticar'),label:'Ir para a prática'}}
    />
  </ReaderShell>
}

function FlashAgenda({progress,today}:{progress:Progress;today:string}){
  const fresh=CARDS.filter(c=>!progress.reviews[c.id]).length
  const due=CARDS.filter(c=>progress.reviews[c.id]&&progress.reviews[c.id]!.due.slice(0,10)<=today).length
  const later=CARDS.length-fresh-due
  const parts=[{label:'Novos',n:fresh,color:'var(--color-line)'},{label:'Para hoje',n:due,color:'var(--color-amber)'},{label:'Agendados',n:later,color:'var(--color-ok)'}]
  return <div className="mt-5" aria-label="Agenda de revisão">
    <div className="flex h-3 overflow-hidden rounded-full">{parts.map(part=>part.n>0&&<div key={part.label} style={{width:`${part.n/CARDS.length*100}%`,background:part.color,transition:'width 300ms ease'}}/>)}</div>
    <ul className="m-0 mt-2 flex list-none flex-wrap gap-x-4 p-0 text-xs text-[var(--color-ink-soft)]">{parts.map(part=><li key={part.label} className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{background:part.color}}/>{part.label}: {part.n}</li>)}</ul>
  </div>
}

function Flashcards({progress,update}:{progress:Progress;update:Update}){
  const [index,setIndex]=useState(0)
  const [show,setShow]=useState(false)
  const [onlyDue,setOnlyDue]=useState(false)
  const today=new Date().toISOString().slice(0,10)
  const cards=useMemo(()=>CARDS.filter(card=>!onlyDue||!progress.reviews[card.id]||progress.reviews[card.id]!.due.slice(0,10)<=today),[onlyDue,progress.reviews,today])
  const card=cards[Math.min(index,cards.length-1)]
  const rate=(days:number)=>{
    if(!card)return
    const due=new Date(Date.now()+days*86400000).toISOString()
    update(p=>({...p,reviews:{...p.reviews,[card.id]:{due,intervalDays:days,seen:(p.reviews[card.id]?.seen ?? 0)+1}}}))
    setShow(false);setIndex(i=>onlyDue?Math.max(0,i):Math.min(cards.length-1,i+1))
  }
  return <div className="mx-auto max-w-3xl px-4 py-10"><h1 className="font-serif text-3xl">120 flashcards para lembrar sem consultar</h1>
    <p className="mt-3 text-[var(--color-ink-soft)]">Lembre a definição e o cenário antes de revelar. Marque Errei (1 dia), Hesitei (3 dias) ou Sei (7 dias); a agenda fica apenas neste navegador.</p>
    <FlashAgenda progress={progress} today={today}/>
    <label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyDue} onChange={e=>{setOnlyDue(e.target.checked);setIndex(0);setShow(false)}}/> Mostrar só cartões para revisar hoje</label>
    {!card?<p className="mt-8">Nenhum cartão pendente. Volte mais tarde ou desative o filtro.</p>:<>
      <FlipCard flipped={show} onFlip={()=>setShow(v=>!v)} meta={`${card.id} · cartão ${Math.min(index+1,cards.length)} de ${cards.length}`} front={card.front} back={card.back}/>
      <div className="mt-4 flex flex-wrap justify-center gap-2">{show?<><button className="choice" onClick={()=>rate(1)}>Errei · 1 dia</button><button className="choice" onClick={()=>rate(3)}>Hesitei · 3 dias</button><button className="choice" onClick={()=>rate(7)}>Sei · 7 dias</button></>:<button className="choice" onClick={()=>setShow(true)}>Revelar resposta</button>}</div>
      <div className="mt-5 flex justify-between"><button className="choice" disabled={index===0} onClick={()=>{setIndex(i=>i-1);setShow(false)}}>Anterior</button><button className="choice" disabled={index>=cards.length-1} onClick={()=>{setIndex(i=>i+1);setShow(false)}}>Próximo</button></div>
    </>}
  </div>
}

function FindContent({glossary=false}:{glossary?:boolean}){
  const [query,setQuery]=useState('')
  const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  const needle=normalize(query.trim())
  const matches=glossary?CARDS.filter(card=>!needle||normalize(`${card.front} ${card.back}`).includes(needle)):chapters.filter(ch=>!needle||normalize(ch.plain).includes(needle)).slice(0,30)
  return <div className="mx-auto max-w-4xl px-4 py-10"><h1 className="font-serif text-3xl">{glossary?'Glossário de IA e serviços':'Buscar na apostila'}</h1>
    {glossary&&<p className="mt-2 text-sm text-[var(--color-ink-soft)]">Neste curso, o glossário são os 120 flashcards: cada termo com sua definição curta. Para estudar com revisão espaçada, use <Link to={p('/flashcards')}>Flashcards</Link>.</p>}
    <label htmlFor="aif-search" className="mt-5 block text-sm font-semibold">{glossary?'Conceito ou sigla':'Assunto, técnica, produto ou capítulo'}</label>
    <div className="mt-2 flex items-center gap-2 rounded-xl border border-[var(--color-line)] px-3"><Search className="h-4 w-4"/><input id="aif-search" className="w-full bg-transparent py-3 outline-none" value={query} onChange={event=>setQuery(event.target.value)} placeholder="RAG, AgentCore, métricas, segurança..."/></div>
    <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{matches.length} resultado(s){!needle?' (limite inicial de exibição)':''}</p>
    <div className="mt-4 space-y-3">{glossary?(matches as Flashcard[]).map(card=><div key={card.id} className="rounded-lg border border-[var(--color-line)] p-4"><h2 className="font-semibold">{card.front}</h2><p className="mt-1 text-sm">{card.back}</p></div>):(matches as Chapter[]).map(ch=><Link key={ch.id} className="block rounded-lg border border-[var(--color-line)] p-4 hover:border-[var(--color-amber)]" to={p(`/ler/${ch.id}`)}><h2 className="font-semibold">{ch.number}. {ch.title}</h2><p className="mt-1 text-sm text-[var(--color-ink-soft)]">Abrir capítulo →</p></Link>)}
    </div>
  </div>
}

function ProgressPage({progress,update,warning}:{progress:Progress;update:Update;warning:boolean}){
  const exportData=()=>{const blob=new Blob([JSON.stringify({exam:'AIF-C01',progress},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='rota-cloud-aif-c01-progresso.json';a.click();URL.revokeObjectURL(url)}
  return <div className="mx-auto max-w-4xl px-4 py-10"><h1 className="font-serif text-3xl">Seu progresso no AIF-C01</h1>
    <p className="mt-3 text-[var(--color-ink-soft)]">Seu progresso é salvo neste navegador, separado do curso Cloud Practitioner. Exporte uma cópia para guardar seu histórico.</p>
    {warning&&<p className="mt-3 text-sm text-[var(--color-amber)]" role="status">O navegador não permitiu salvar; os dados permanecem apenas nesta sessão.</p>}
    <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-[var(--color-line)] p-5"><p>Capítulos concluídos</p><strong className="font-serif text-3xl">{progress.completed.length}/30</strong></div><div className="rounded-xl border border-[var(--color-line)] p-5"><p>Tentativas finalizadas</p><strong className="font-serif text-3xl">{progress.attempts.length}</strong></div><div className="rounded-xl border border-[var(--color-line)] p-5"><p>Cartões revisados</p><strong className="font-serif text-3xl">{Object.keys(progress.reviews).length}/120</strong></div></div>
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <section className="diagram-shell my-0"><p className="diagram-kicker">Acertos por domínio</p><p className="diagram-title">Última resposta de cada questão</p><div className="mt-3 grid gap-2">{[1,2,3,4,5].map(d=>{
        const answered=[...itemById.values()].filter(q=>q.domain===d&&progress.answers[q.id]!==undefined)
        const right=answered.filter(q=>grade(q,progress.answers[q.id])).length
        return <Meter key={d} label={`Domínio ${d}`} value={answered.length?right/answered.length:0} display={answered.length?`${right}/${answered.length}`:'sem respostas'} tone={!answered.length?'dim':right/answered.length>=0.8?'ok':right/answered.length>=0.6?'warn':'bad'}/>
      })}</div><p className="m-0 mt-2 text-xs text-[var(--color-ink-soft)]">Domínio abaixo de 80%? Revise os capítulos dele no mapa de cobertura (cap. 30).</p></section>
      <section className="diagram-shell my-0"><p className="diagram-kicker">Leitura por módulo</p><p className="diagram-title">Capítulos marcados como estudados</p><div className="mt-3 grid gap-2">{modules.map(m=>{
        const n=m.chapter_ids.filter(id=>progress.completed.includes(id)).length
        return <Meter key={m.id} label={m.title} value={n/m.chapter_ids.length} display={`${n}/${m.chapter_ids.length}`} tone={n===m.chapter_ids.length?'ok':'focus'}/>
      })}</div></section>
    </div>
    <div className="mt-6 flex flex-wrap gap-3"><button className="choice" onClick={exportData}><Download className="mr-1 inline h-4 w-4"/> Exportar JSON</button><button className="choice" onClick={()=>{if(window.confirm('Apagar apenas o progresso AIF-C01 salvo neste navegador?'))update(()=>blank())}}>Apagar progresso do AIF-C01</button></div>
    <h2 className="mt-8 font-semibold">Histórico de prática</h2><ul className="mt-3 space-y-2">{progress.attempts.slice().reverse().slice(0,15).map(a=><li key={a.id} className="rounded-lg border border-[var(--color-line)] p-3 text-sm">
      {new Date(a.date).toLocaleString('pt-BR')} · {a.mode}: {a.correct}/{a.total}
      <details className="mt-2"><summary>Revisar erros desta sessão</summary>
        <ul className="mt-2 space-y-3">{Object.entries(a.responses ?? {}).filter(([id,picked])=>{const item=itemById.get(id);return item&&!grade(item,picked)}).map(([id,picked])=>{
          const item=itemById.get(id)!
          return <li key={id} className="rounded-md border border-[var(--color-line)] p-3"><ItemView item={item} answer={picked} onChange={()=>undefined} locked revealed heading="h3"/>{item.type!=='single'&&<p className="mt-2 text-xs text-[var(--color-ink-soft)]">Resposta certa: {correctText(item)}</p>}</li>
        })}</ul>
      </details>
    </li>)}</ul>
  </div>
}

export function AifCourseApp(){
  const location=useLocation()
  const route=location.pathname.replace(/^\/cursos\/aif-c01\/?/,'')
  const {progress,update,storageWarning}=useAifProgressState()
  const context=useMemo(()=>({progress,update}),[progress,update])
  const [integrity,setIntegrity]=useState<'checking'|'ok'|'invalid'>('checking')
  useEffect(()=>{
    const encoded=new TextEncoder().encode(source)
    if(typeof crypto==='undefined'||!crypto.subtle){setIntegrity('invalid');return}
    void crypto.subtle.digest('SHA-256',encoded).then(buffer=>{
      const digest=[...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,'0')).join('')
      setIntegrity(digest===curriculumJson.metadata.sha256?'ok':'invalid')
    }).catch(()=>setIntegrity('invalid'))
  },[])
  useEffect(()=>{window.scrollTo({top:0,behavior:'instant'})},[location.pathname])
  if(integrity==='checking')return <div className="mx-auto max-w-3xl p-8">Conferindo integridade da apostila AIF-C01...</div>
  if(integrity==='invalid')return <div className="mx-auto max-w-3xl p-8" role="alert"><h1 className="font-serif text-3xl">A apostila e os dados não conferem</h1><p>Regenere os dados com <code>python3 scripts/extract_aif_study_data.py</code>. Verifique também o suporte do navegador a criptografia Web Crypto.</p></div>
  return <AifProgressContext.Provider value={context}>{page()}</AifProgressContext.Provider>
  function page(){
    if(route===''||route==='/')return <StudyHome progress={progress}/>
    if(route==='trilhas')return <div className="mx-auto max-w-4xl px-4 py-10"><h1 className="font-serif text-3xl">Sua trilha de estudos AIF-C01</h1><p className="mb-2 mt-2 text-[var(--color-ink-soft)]">30 capítulos distribuídos por dependência de aprendizado, e não pela ordem do guia oficial.</p><div className="diagram-shell max-w-none"><p className="diagram-kicker">Mapa da trilha</p><p className="diagram-title">{progress.completed.length} de 30 capítulos concluídos</p><RouteMap courseId="aif-c01" modules={modules} completed={progress.completed}/></div><ChapterLinks progress={progress} update={update}/></div>
    const read=route.match(/^ler\/(chapter-\d{2})(?:\/(.+))?$/)
    if(read){const chapter=chapterById.get(read[1]!);return chapter?<Reader key={chapter.id} chapter={chapter} progress={progress} update={update}/>:<p>Capítulo não encontrado.</p>}
    if(route==='praticar')return <PracticeHub/>
    if(route==='praticar/treino'||route==='praticar/formatos')return <Drill key={route} mode={route.endsWith('formatos')?'formatos':'treino'}/>
    if(route==='praticar/simulado')return <ExamScreen/>
    if(route==='flashcards')return <Flashcards progress={progress} update={update}/>
    if(route==='glossario'||route.startsWith('glossario/'))return <FindContent glossary/>
    if(route==='busca')return <FindContent/>
    if(route==='progresso')return <ProgressPage progress={progress} update={update} warning={storageWarning}/>
    return <div className="mx-auto max-w-2xl px-4 py-10"><h1 className="font-serif text-3xl">Página não encontrada neste curso</h1><Link className="mt-4 inline-block text-[var(--color-navy)]" to={p()}>Voltar ao AIF-C01</Link></div>
  }
}
