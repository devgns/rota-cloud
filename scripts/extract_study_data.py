#!/usr/bin/env python3
"""Extract deterministic supporting JSON data from the original AWS CLF-C02 Markdown.
These JSON files are derived data for UI implementation, not replacements for the source.
"""
import re, json, hashlib, unicodedata, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
SRC=ROOT/'content'/'Apostila_AWS_Cloud_Practitioner_CLF-C02_Completa.md'
if not SRC.exists():
 SRC=ROOT/'Apostila_AWS_Cloud_Practitioner_CLF-C02_Completa.md'
OUT=ROOT/'data'
OUT.mkdir(parents=True,exist_ok=True)
s=SRC.read_text(encoding='utf-8')
source_sha=hashlib.sha256(s.encode('utf-8')).hexdigest()
chap_regex=re.compile(r'^# (\d{1,2})\. (.+)$', re.M)
chap_match=list(chap_regex.finditer(s))
modules=[
 ('intro','Comece aqui',list(range(1,2))),
 ('fundamentos','Fundamentos e arquitetura',list(range(2,6))),
 ('seguranca','Segurança por camadas',list(range(6,10))),
 ('construcao','Construindo sistemas',list(range(10,15))),
 ('integracao','Operando e integrando',list(range(15,19))),
 ('custos','Custos e suporte',list(range(19,21))),
 ('revisao','Aplicação e revisão',list(range(21,27)))
]
modmap={i:mid for mid,_,nums in modules for i in nums}
domainmap={1:[1,2,3,4],2:[1],3:[1,3],4:[1],5:[1,4],6:[2],7:[2],8:[2],9:[2,3],10:[3],11:[3],12:[3],13:[3],14:[3],15:[3],16:[3],17:[3],18:[3],19:[1,4],20:[4],21:[1,2,3,4],22:[1,2,3,4],23:[1,2,3,4],24:[1,2,3,4],25:[1,2,3,4],26:[1,2,3,4]}

def slug(t):
 t=unicodedata.normalize('NFD',t)
 t=''.join(x for x in t if unicodedata.category(x)!='Mn')
 t=re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')
 return t
chapters=[]
for idx,match in enumerate(chap_match):
 i=int(match.group(1)); title=match.group(2).strip()
 start=match.end(); end=chap_match[idx+1].start() if idx+1<len(chap_match) else len(s)
 body=s[start:end]
 subheads=[]
 for m in re.finditer(r'^#{2,4} ([^\n]+)$',body,re.M):
  level=len(m.group().split(' ')[0]); text=m.group(1)
  subheads.append({'id':f'c{i:02}-{slug(text)[:75]}','title':text,'heading_level':level})
 chapters.append({'id':f'chapter-{i:02}', 'original_number':i,'title':title,'module_id':modmap[i], 'domains':domainmap[i], 'source_heading':match.group(0), 'subheadings':subheads})
assert len(chapters)==26 and sorted(x['original_number'] for x in chapters)==list(range(1,27))
catalog={ 'metadata': {'generated_from': SRC.name, 'sha256':source_sha, 'chapter_count':len(chapters), 'question_count':80,'flashcard_count':132, 'editorial_warning':'Derived navigation metadata, not a replacement for full Markdown. Verify domain labels; mapping is editorial.'},
 'modules':[{'id':mid,'title':title,'chapter_ids':[f'chapter-{i:02}' for i in nums]} for mid,title,nums in modules],
 'chapters':chapters}
(OUT/'CURRICULO_CLF-C02.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

pA=s.split('## Parte A — questões',1)[1].split('## Parte B — gabarito rápido',1)[0]
pQuick=s.split('## Parte B — gabarito rápido',1)[1].split('## Parte C — gabarito comentado',1)[0]
pComment=s.split('## Parte C — gabarito comentado',1)[1].split('# 24. Flashcards para revisão ativa',1)[0]
quick=dict((f'Q{n}',list(keys)) for n,keys in re.findall(r'\*\*Q(\d{2}): ([A-D]+)\*\*',pQuick))
assert len(quick)==80, f'quick {len(quick)}'
comment=dict()
for m in re.finditer(r'(?ms)^\*\*Q(\d{2}) — ([A-D](?: e [A-D])?)\.\*\* (.*?)(?=^\*\*Q\d{2} —|\Z)',pComment):
 key='Q'+m.group(1)
 txt=m.group(3).strip()
 explanation=txt.split('**Alternativa(s) correta(s):**')[0].strip()
 comment[key]={'correct_header':m.group(2).replace(' e ',''),'explanation':explanation, 'full_text':txt}
assert len(comment)==80,f'comment {len(comment)}'
qs=[]
for m in re.finditer(r'(?ms)^### Q(\d{2}) — Domínio (\d) — (ESCOLHA ÚNICA|MÚLTIPLA RESPOSTA)\s*\n(.*?)(?=^### Q\d{2} —|\Z)',pA):
 ident='Q'+m.group(1); d=int(m.group(2)); kind='single' if 'ÚNICA' in m.group(3) else 'multiple'
 body=m.group(4).strip(); lines=body.splitlines(); opt=[]; first_opt=None
 for idx,line in enumerate(lines):
  om=re.match(r'^- \*\*([A-D])\)\*\*\s+(.+)$',line)
  if om:
   if first_opt is None: first_opt=idx
   opt.append({'id':om.group(1),'text':om.group(2).strip()})
 assert first_opt is not None and len(opt)==4,(ident,len(opt))
 stem='\n'.join(lines[:first_opt]).strip()
 key=quick[ident]; kc=comment[ident]
 assert set(key)==set(kc['correct_header']),(ident,key,kc['correct_header'])
 assert kind=='multiple' or len(key)==1,(ident,kind,key)
 assert kind=='single' or len(key)>1,(ident,kind,key)
 assert set(key).issubset(set(a['id'] for a in opt)),ident
 qs.append({'id':ident,'source_chapter_id':'chapter-23','domain':d,'kind':kind,'selection_count':len(key), 'statement_markdown':stem,'options':opt,'correct_option_ids':key,'explanation_markdown':kc['explanation']})
assert len(qs)==80,f'qs {len(qs)}'
assert len({q['id'] for q in qs})==80
assert sum(q['domain']==1 for q in qs)==20
assert sum(q['domain']==2 for q in qs)==24
assert sum(q['domain']==3 for q in qs)==27
assert sum(q['domain']==4 for q in qs)==9
(OUT/'QUESTOES_CLF-C02_80.json').write_text(json.dumps({'metadata':{'source':SRC.name,'sha256':source_sha,'count':80,'domains':{'1':20,'2':24,'3':27,'4':9},'status':'authorial, not AWS official','expected_selection_mode':'single or multiple as indicated'},'questions':qs},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

fc=s.split('# 24. Flashcards para revisão ativa',1)[1].split('# 25. Laboratórios, cronograma',1)[0]
flash=[]; cat='Sem categoria'
for line in fc.splitlines():
 hm=re.match(r'^## (.+)$',line)
 if hm: cat=hm.group(1).strip()
 if not line.startswith('|') or line.startswith('|---') or line.startswith('| Pergunta ') or re.fullmatch(r'\|(?:\s*-+\s*\|)+',line): continue
 cells=[c.strip() for c in line.strip().strip('|').split('|')]
 assert len(cells)==2,(cat,line)
 if not cells[0] or not cells[1]: raise ValueError('Empty card')
 ident=f'FC{len(flash)+1:03}'
 flash.append({'id':ident,'category':cat,'front_markdown':cells[0],'back_markdown':cells[1], 'source_chapter_id':'chapter-24'})
assert len(flash)==132,len(flash)
(OUT/'FLASHCARDS_CLF-C02_132.json').write_text(json.dumps({'metadata':{'source':SRC.name,'sha256':source_sha,'count':len(flash),'category_count':len(set(x['category'] for x in flash))},'flashcards':flash},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('PASS: 26 chapters; 80 questions + 80 answers; 132 flashcards; source SHA',source_sha)
print('Multiple choice IDs:',[q['id'] for q in qs if q['kind']=='multiple'])
print('Catalog sizes:',[(x.name,x.stat().st_size) for x in [OUT/'CURRICULO_CLF-C02.json',OUT/'QUESTOES_CLF-C02_80.json',OUT/'FLASHCARDS_CLF-C02_132.json']])
