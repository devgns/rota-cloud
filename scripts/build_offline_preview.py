#!/usr/bin/env python3
"""Render a fully offline, single-file study preview using original Markdown.
Not a replacement for the React integration: it is a reviewer-friendly artifact.
Requires mistune 3 and Graphviz ('dot') only at *build time*.
"""
from __future__ import annotations
import html, json, re, subprocess, textwrap
from pathlib import Path
import mistune

ROOT=Path(__file__).resolve().parent.parent
SRC=ROOT/'content'/'Apostila_AWS_AI_Practitioner_AIF-C01_Completa.md'
text=SRC.read_text(encoding='utf-8')
q=json.loads((ROOT/'data/QUESTOES_AIF-C01_80.json').read_text())['questions']
f=json.loads((ROOT/'data/FLASHCARDS_AIF-C01_120.json').read_text())['flashcards']

def svg_graph(mermaid:str)->str:
    if 'sequenceDiagram' in mermaid:
        parts={m[0]:m[1] for m in re.findall(r'^\s*participant\s+(\w+)\s+as\s+(.+)$',mermaid,re.M)}
        blocks=[]
        for m in re.finditer(r'^\s*(\w+)(?:-->>|->>)(\w+):\s*(.+)$',mermaid,re.M):
            blocks.append(f'<li><b>{html.escape(parts.get(m[1],m[1]))} → {html.escape(parts.get(m[2],m[2]))}</b><span>{html.escape(m[3])}</span></li>')
        return '<div class="sequence"><ol>'+''.join(blocks)+'</ol></div>'
    orientation='LR' if 'flowchart LR' in mermaid else 'TB'
    nodes={}
    subgraph_names={m for m in re.findall(r'^\s*subgraph\s+(\w+)\[',mermaid,re.M)}
    for match in re.finditer(r'\b([A-Za-z][\w]*)\s*(\[\([^\]]+\)\]|\[[^\]]+\]|\{[^}]+\})',mermaid):
        node,shape=match.groups()
        if node in subgraph_names:continue
        value=re.sub(r'^\[\(|^\[|^\{|\)\]$|\]$|\}$','',shape).strip('"\' ')
        value=value.replace('<br>',' ').replace('<br/>',' ')
        nodes[node]=(value,shape.startswith('{'))
    edges=[]
    for line in mermaid.splitlines():
        if '-->' not in line and '-.->' not in line:continue
        stripped=re.sub(r'\[\([^\]]+\)\]|\[[^\]]+\]|\{[^}]+\}','',line)
        for m in re.finditer(r'\b([A-Za-z][\w]*)\s*(-->|-\.->)\s*(?:\|([^|]+)\|\s*)?\b([A-Za-z][\w]*)',stripped):
            if m[1] in nodes and m[4] in nodes:edges.append(m.groups())
    dot=[f'digraph G {{rankdir={orientation}; bgcolor="transparent"; graph [nodesep=.35,ranksep=.65,pad=.2]; node [shape=box,style="rounded,filled",fontname="Arial",fontsize=11,penwidth=1.2,margin=".16,.13"]; edge [color="#748497",arrowsize=.55,penwidth=1.15,fontname="Arial",fontsize=9];']
    for name,(title,isdecision) in nodes.items():
        label='\\n'.join(textwrap.wrap(title,27))
        shape='diamond' if isdecision else 'box'
        fill='#FFF2D5' if isdecision else '#EAF0F4'
        dot.append(f'{name} [label={json.dumps(label)},shape={shape},fillcolor="{fill}",color="#365C7B",fontcolor="#17344B"];')
    for start,arr,label,end in edges:
        label=f'label={json.dumps(label)},' if label else ''
        style='dashed' if arr=='-.->' else 'solid'
        dot.append(f'{start} -> {end} [{label}style={style}];')
    dot.append('}')
    try:
        proc=subprocess.run(['dot','-Tsvg'],input='\n'.join(dot),text=True,capture_output=True,check=True,timeout=15)
        svg=proc.stdout
        svg=svg[svg.index('<svg'):]
        return '<div class="svg-stage" role="img" aria-label="Fluxograma ilustrativo com etapas e conexões">'+svg+'</div>'
    except Exception:
        return '<pre class="mermaid-code">'+html.escape(mermaid)+'</pre>'

class Renderer(mistune.HTMLRenderer):
    def heading(self,text,level,**attrs):
        stripped=re.sub(r'<[^>]+>','',text)
        anchor=re.sub(r'[^a-z0-9]+','-',stripped.lower()).strip('-')
        return f'<h{level} id="{anchor}">{text}</h{level}>\n'
    def block_code(self,code,info=None):
        if info and info.startswith('mermaid'):
            visual=svg_graph(code)
            return '<figure class="visual"><figcaption>Fluxo conceitual · diagrama original</figcaption>'+visual+'<details><summary>Consultar Mermaid original</summary><pre>'+html.escape(code)+'</pre></details></figure>'
        return '<pre><code>'+html.escape(code)+'</code></pre>'

parse=mistune.create_markdown(renderer=Renderer(),plugins=['table','strikethrough','url'])
h=list(re.finditer(r'^# (\d{1,2})\. (.+)$',text,re.M))
chapters=[]
for i,m in enumerate(h):
    chapters.append({'id':f'chapter-{int(m[1]):02}', 'n':int(m[1]),'title':m[2],
      'body':parse(text[m.start():h[i+1].start() if i+1<len(h) else len(text)])})
nav=''.join(f'<button class="chapter-link" data-target="{c["id"]}"><span class="mark" aria-hidden="true">○</span><span>{c["n"]:02}. {html.escape(c["title"])}</span></button>' for c in chapters)
articles=''.join(f'<article id="{c["id"]}" class="lesson" data-title="{html.escape(c["title"])}" hidden><div class="eyebrow">AIF-C01 · Capítulo {c["n"]} de 30</div>{c["body"]}<div class="lesson-actions"><button class="complete" data-id="{c["id"]}">Marcar como estudado</button><button class="next" data-id="{c["id"]}">Próximo capítulo →</button></div></article>' for c in chapters)
qdata=json.dumps(q,ensure_ascii=False).replace('</','<\\/')
fdata=json.dumps(f,ensure_ascii=False).replace('</','<\\/')

PAGE=r'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Rota Cloud — AIF-C01 · Prévia offline</title>
<style>
:root{--paper:#faf8f3;--panel:#fffdf9;--ink:#1e2b35;--muted:#63717c;--line:#d9dbd8;--accent:#bc8135;--navy:#24455f;--wash:#edf2f5;--code:#f3f0e9;--shadow:0 12px 30px #20344b14}
[data-theme=dark]{--paper:#151e27;--panel:#1e2b34;--ink:#f0eeea;--muted:#b2bec7;--line:#47515a;--accent:#e0a75b;--navy:#94bbd5;--wash:#273a49;--code:#293943;--shadow:0 12px 30px #0005}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:var(--paper);font:16px/1.68 system-ui,-apple-system,Segoe UI,sans-serif}h1,h2,h3{font-family:Georgia,Cambria,'Times New Roman',serif;line-height:1.2}a{color:var(--navy)}button,input{font:inherit}button{cursor:pointer}header{position:sticky;top:0;z-index:15;height:69px;display:flex;align-items:center;gap:16px;background:var(--panel);border-bottom:1px solid var(--line);padding:0 max(18px,calc((100vw - 1500px)/2));box-shadow:0 2px 8px #00000009}.logo{font-family:Georgia,serif;font-weight:800;color:var(--navy);font-size:1.38rem;white-space:nowrap}.tag{background:var(--wash);border:1px solid var(--line);color:var(--navy);border-radius:28px;padding:3px 10px;font-size:.78rem;font-weight:700}header .tools{margin-left:auto;display:flex;align-items:center;gap:7px}.button{border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);padding:8px 12px}.button:hover,.chapter-link:hover,.quiz-choice:hover{border-color:var(--accent)}.layout{max-width:1560px;margin:auto;display:grid;grid-template-columns:278px minmax(0,850px) 210px;gap:25px;padding:28px 22px}.side{position:sticky;top:97px;max-height:calc(100vh - 130px);overflow:auto}.left{border-right:1px solid var(--line);padding-right:13px}.right{padding-left:5px}.side h2{font-family:system-ui,sans-serif;text-transform:uppercase;letter-spacing:.12em;font-size:.69rem;color:var(--muted);margin:0 0 12px}.chapter-link{border:1px solid transparent;border-radius:9px;background:transparent;color:var(--ink);display:flex;gap:9px;width:100%;text-align:left;font-size:.79rem;line-height:1.34;margin-bottom:3px;padding:8px 6px}.chapter-link.active{background:var(--wash);font-weight:700;border-color:var(--line)}.mark{color:var(--accent);font-size:1rem}.search{width:100%;border:1px solid var(--line);border-radius:10px;padding:10px;background:var(--panel);color:var(--ink);margin-bottom:12px}.content{min-width:0;padding-bottom:90px}.eyebrow{color:var(--accent);font-size:.74rem;letter-spacing:.13em;font-weight:800;text-transform:uppercase}.lesson h1{font-size:2.7rem;margin:12px 0 30px}.lesson h2{font-size:1.7rem;margin-top:42px;scroll-margin-top:92px}.lesson h3{font-size:1.25rem;margin-top:28px}.lesson p{max-width:75ch}.lesson blockquote{border-left:3px solid var(--accent);margin:20px 0;padding:10px 18px;background:var(--wash);border-radius:0 9px 9px 0}.lesson ul,.lesson ol{padding-left:24px}.lesson li{margin:6px 0}.lesson table{border-collapse:collapse;width:100%;min-width:570px;font-size:.88rem}.lesson table td,.lesson table th{border-bottom:1px solid var(--line);padding:9px 10px;text-align:left}.lesson table th{background:var(--wash)}.lesson table{display:block;overflow-x:auto}.lesson code{background:var(--code);padding:1px 4px;border-radius:3px;font-size:.89em}.lesson pre{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--code);border:1px solid var(--line);border-radius:8px;padding:16px;font-size:.8rem}.lesson hr{border:0;border-top:1px solid var(--line);margin:38px 0}.lesson-actions{margin-top:42px;border-top:1px solid var(--line);padding-top:22px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.lesson-actions button{background:var(--navy);color:var(--paper);border:0;border-radius:10px;padding:10px 14px;font-weight:700}figure.visual{margin:26px 0;background:var(--panel);padding:18px;border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow)}figure figcaption{text-transform:uppercase;letter-spacing:.11em;font-size:.69rem;color:var(--accent);font-weight:800;margin-bottom:14px}.svg-stage{overflow-x:auto;padding:10px;background:#fdfefe;border-radius:8px}.svg-stage svg{max-width:100%;height:auto;min-width:420px}figure details{margin-top:12px;color:var(--muted);font-size:.8rem}figure pre{max-height:180px;overflow:auto}.sequence ol{list-style:none;padding:0;margin:0}.sequence li{display:flex;flex-wrap:wrap;gap:12px;border-left:3px solid var(--accent);padding:10px 15px;margin:8px;background:var(--wash);border-radius:6px}.sequence li span{color:var(--muted)}.progressbar{height:7px;border-radius:9px;background:var(--line);margin:9px 0}.progressfill{height:100%;background:var(--accent);width:0;border-radius:9px;transition:width .2s}.progress-value{font-size:.82rem;color:var(--muted)}.panel{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px;margin:18px 0}.panel h2{margin-top:2px}.quiz-choice{display:block;width:100%;border:1px solid var(--line);text-align:left;color:var(--ink);background:var(--panel);border-radius:9px;padding:12px;margin:8px 0}.quiz-choice.correct{border-color:#548a6d;background:var(--wash)}.quiz-choice.wrong{border-color:#b46c59;background:var(--wash)}.quiz-choice:disabled{cursor:default}.feedback{margin:16px 0;padding:15px;border-left:3px solid var(--accent);background:var(--wash);border-radius:4px}.nav-controls{display:flex;flex-wrap:wrap;gap:9px;margin:14px 0}.nav-controls button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:10px;padding:9px 14px}.nav-controls button:disabled{opacity:.4;cursor:not-allowed}.cardfront{font-family:Georgia,serif;font-size:1.8rem;text-align:center;min-height:110px;display:grid;place-items:center}.cardback{background:var(--wash);padding:18px;border-radius:9px}.toc-link{display:block;color:var(--muted);margin:8px 0;text-decoration:none;font-size:.78rem}.toc-link:hover{color:var(--navy)}#mini-cards{display:none}.disclaimer{font-size:.79rem;color:var(--muted)}.topic-tabs{display:flex;flex-wrap:wrap;gap:9px;margin:12px 0 22px}.topic-tabs button{background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:20px;padding:6px 12px}.topic-tabs button.active{background:var(--navy);color:var(--paper)}#mobilechap{display:none}@media(max-width:1200px){.layout{grid-template-columns:245px minmax(0,1fr)}.right{display:none}}@media(max-width:780px){header{padding:10px 15px;gap:8px;height:auto;flex-wrap:wrap}header .tools{margin-left:0}.logo{font-size:1.1rem}.layout{display:block;padding:16px}.left{position:static;border:0;display:none}.content{padding:0}.lesson h1{font-size:2.1rem}.lesson h2{font-size:1.45rem}#mobilechap{display:block;max-width:100%;margin-bottom:20px}.svg-stage svg{min-width:380px} .tag{font-size:.65rem}}
</style></head><body>
<header><a href="#" class="logo" id="brand">◈ Rota Cloud</a><span class="tag">AWS · AIF-C01</span><span class="tag">PRÉVIA OFFLINE</span><div class="tools"><button class="button" id="homeButton">Início</button><button class="button" id="practiceButton">Questões</button><button class="button" id="flashButton">Cartões</button><button class="button" id="themeButton">☾ Tema</button></div></header>
<div class="layout"><aside class="side left"><h2>Trilha de aprendizagem</h2><input class="search" type="search" id="search" aria-label="Buscar capítulos" placeholder="Buscar capítulo ou conceito..."/><nav id="chapterNav">__NAV__</nav></aside>
<main class="content" id="main" aria-live="polite"><select id="mobilechap" class="search" aria-label="Escolher capítulo"><option>Escolher capítulo</option>__OPTIONS__</select>__ARTICLES__
<section id="practice" class="panel" hidden><div class="eyebrow">Prática original</div><h1>80 questões comentadas</h1><p class="disclaimer">Exercícios autorais. Esta prévia utiliza alternativas de escolha única e não representa a pontuação oficial.</p><div id="questionText"></div><div id="questionOptions"></div><div id="questionFeedback"></div><div class="nav-controls"><button id="prevQuestion">← Anterior</button><button id="nextQuestion">Próxima →</button></div><p id="questionCounter" class="progress-value"></p></section>
<section id="flash" class="panel" hidden><div class="eyebrow">Revisão ativa</div><h1>120 flashcards</h1><p class="disclaimer">Revele, tente recordar e marque quando revisar novamente.</p><div class="cardfront" id="cardFront"></div><div id="cardBack" class="cardback" hidden></div><div class="nav-controls"><button id="reveal">Revelar verso</button><button id="cardWrong">Errei · 1 dia</button><button id="cardMaybe">Hesitei · 3 dias</button><button id="cardRight">Sei · 7 dias</button><button id="nextCard">Próximo →</button></div><p id="cardCounter" class="progress-value"></p></section>
</main><aside class="side right"><h2>Seu progresso</h2><div class="progress-value" id="progressCount">0/30 capítulos</div><div class="progressbar"><div class="progressfill" id="progressFill"></div></div><h2 style="margin-top:24px">Neste capítulo</h2><nav id="toc"></nav><p class="disclaimer">Estudo independente, não afiliado à AWS. Confira sempre o guia oficial.</p></aside></div>
<script id="questionsJson" type="application/json">__QUESTIONS__</script><script id="cardsJson" type="application/json">__CARDS__</script>
<script>
(()=>{
 const questions=JSON.parse(document.getElementById('questionsJson').textContent), cards=JSON.parse(document.getElementById('cardsJson').textContent);
 const lessons=Array.from(document.querySelectorAll('article.lesson'));
 const select=document.getElementById('mobilechap'),toc=document.getElementById('toc');let active=0,questionIndex=0,cardIndex=0;const KEY='rota-cloud-aif-c01-preview-progress-v1';
 let state={done:[],answer:{},cardReview:{},theme:'light'};
 try{state={...state,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{};
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
 const currentLesson=()=>lessons[active];
 const escape=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 const hide=()=>{lessons.forEach(x=>x.hidden=true);document.getElementById('practice').hidden=true;document.getElementById('flash').hidden=true};
 const markProgress=()=>{
  document.getElementById('progressCount').textContent=`${state.done.length}/30 capítulos`;
  document.getElementById('progressFill').style.width=`${100*state.done.length/30}%`;
  document.querySelectorAll('.chapter-link').forEach(b=>{const complete=state.done.includes(b.dataset.target);b.querySelector('.mark').textContent=complete?'✓':'○';b.classList.toggle('active',b.dataset.target===currentLesson().id)});
  document.querySelectorAll('.complete').forEach(b=>{b.textContent=state.done.includes(b.dataset.id)?'✓ Capítulo estudado':'Marcar como estudado'})
 };
 const showChapter=(index)=>{
  active=Math.max(0,Math.min(lessons.length-1,index));hide();const lesson=currentLesson();lesson.hidden=false;select.value=lesson.id;
  toc.innerHTML=Array.from(lesson.querySelectorAll('h2')).map(h=>`<a href="#${h.id}" class="toc-link">${escape(h.textContent)}</a>`).join('');
  markProgress();window.scrollTo(0,0);
 };
 document.querySelectorAll('.chapter-link').forEach((b,i)=>b.onclick=()=>showChapter(i));
 document.querySelectorAll('.complete').forEach(b=>b.onclick=()=>{const id=b.dataset.id;state.done=state.done.includes(id)?state.done.filter(x=>x!==id):[...state.done,id];save();markProgress()});
 document.querySelectorAll('.next').forEach(b=>b.onclick=()=>showChapter(Math.min(active+1,29)));
 select.onchange=()=>{const i=lessons.findIndex(x=>x.id===select.value);if(i>=0)showChapter(i)};
 document.getElementById('search').oninput=e=>{const term=e.target.value.toLocaleLowerCase('pt-BR');document.querySelectorAll('.chapter-link').forEach((b,i)=>{b.hidden=!((lessons[i].dataset.title+' '+lessons[i].innerText).toLocaleLowerCase('pt-BR').includes(term))})};
 document.getElementById('homeButton').onclick=()=>showChapter(0);
 document.getElementById('brand').onclick=e=>{e.preventDefault();showChapter(0)};
 const showQuestion=()=>{
  const q=questions[questionIndex];document.getElementById('questionText').innerHTML=`<p class="eyebrow">Questão ${questionIndex+1}/80 · Domínio ${q.domain}</p><h2>${escape(q.prompt)}</h2>`;
  document.getElementById('questionOptions').innerHTML=q.choices.map((c,i)=>`<button class="quiz-choice" data-opt="${'ABCD'[i]}"><b>${'ABCD'[i]}.</b> ${escape(c)}</button>`).join('');
  const answer=state.answer[q.id];document.querySelectorAll('.quiz-choice').forEach(button=>{
   button.onclick=()=>{state.answer[q.id]=button.dataset.opt;save();showQuestion()};
   if(answer){button.classList.toggle('correct',button.dataset.opt===q.correct);button.classList.toggle('wrong',button.dataset.opt===answer&&answer!==q.correct)};
  });
  document.getElementById('questionFeedback').innerHTML=answer?`<div class="feedback"><b>${answer===q.correct?'Correto.':`Esperado: ${q.correct}.`}</b><p>${escape(q.explanation)}</p></div>`:'';
  document.getElementById('questionCounter').textContent=`Respondidas: ${Object.keys(state.answer).length} de 80`;
  document.getElementById('prevQuestion').disabled=questionIndex===0;document.getElementById('nextQuestion').disabled=questionIndex===79;
 };
 document.getElementById('practiceButton').onclick=()=>{hide();document.getElementById('practice').hidden=false;toc.innerHTML='';showQuestion();window.scrollTo(0,0)};
 document.getElementById('prevQuestion').onclick=()=>{questionIndex--;showQuestion()};document.getElementById('nextQuestion').onclick=()=>{questionIndex++;showQuestion()};
 const showCard=()=>{const c=cards[cardIndex];document.getElementById('cardFront').textContent=c.front;document.getElementById('cardBack').textContent=c.back;document.getElementById('cardBack').hidden=true;document.getElementById('cardCounter').textContent=`Cartão ${cardIndex+1}/120`};
 document.getElementById('flashButton').onclick=()=>{hide();document.getElementById('flash').hidden=false;toc.innerHTML='';showCard();window.scrollTo(0,0)};
 document.getElementById('reveal').onclick=()=>{document.getElementById('cardBack').hidden=false};
 const rate=(days)=>{const id=cards[cardIndex].id;state.cardReview[id]={days,due:new Date(Date.now()+days*86400000).toISOString()};save();cardIndex=(cardIndex+1)%cards.length;showCard()};
 document.getElementById('cardWrong').onclick=()=>rate(1);document.getElementById('cardMaybe').onclick=()=>rate(3);document.getElementById('cardRight').onclick=()=>rate(7);document.getElementById('nextCard').onclick=()=>{cardIndex=(cardIndex+1)%cards.length;showCard()};
 document.getElementById('themeButton').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=state.theme;save()};
 document.documentElement.dataset.theme=state.theme;
 showChapter(0);
})()
</script></body></html>'''
PAGE=PAGE.replace('__NAV__',nav).replace('__ARTICLES__',articles).replace('__OPTIONS__',''.join(f'<option value="{c["id"]}">{c["n"]:02}. {html.escape(c["title"])}</option>' for c in chapters)).replace('__QUESTIONS__',qdata).replace('__CARDS__',fdata)
out=ROOT/'AIF-C01-PREVIA-OFFLINE.html'
out.write_text(PAGE,encoding='utf-8')
print('Offline preview:',out.stat().st_size,'bytes;',len(chapters),'chapters;',text.count('```mermaid'),'inline diagrams; 80 questions; 120 cards')
