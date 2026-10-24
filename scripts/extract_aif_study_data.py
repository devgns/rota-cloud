#!/usr/bin/env python3
"""Validate AIF-C01 canonical Markdown and generate the route curriculum metadata.

JSON question and card banks come from build_aif_bank.py. The original Markdown
remains the sole source of the reading experience. The SHA guards version drift.
"""
from __future__ import annotations
from collections import Counter
from hashlib import sha256
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'content' / 'Apostila_AWS_AI_Practitioner_AIF-C01_Completa.md'
DATA = ROOT / 'data'
DOCS = ROOT / 'docs'
MODS = [
    ('inicio', 'Comece aqui', range(1,2)),
    ('fundamentos-ml', 'Fundamentos e aprendizado de máquina', range(2,8)),
    ('fundamentos-generativos', 'Como funciona a IA generativa', range(8,12)),
    ('aplicacoes-fm', 'Construindo aplicações com FMs', range(12,19)),
    ('ia-responsavel', 'IA responsável e explicável', range(19,21)),
    ('seguranca', 'Proteção, conformidade e governança', range(21,24)),
    ('pratica', 'Síntese e revisão', range(24,31)),
]
DOMAINS = {
  1:[1,2,3,4,5], 2:[1], 3:[1], 4:[1,3], 5:[1], 6:[1,3], 7:[1,2],
  8:[2], 9:[2,3], 10:[2], 11:[2,3], 12:[1,2,3], 13:[3], 14:[2,3],
  15:[2,3], 16:[3], 17:[1,3], 18:[2,3], 19:[4], 20:[4],
  21:[4,5], 22:[5], 23:[5], 24:[1,2,3,4,5], 25:[1,2,3,4,5],
  26:[1,2,3,4,5], 27:[1,2,3,4,5], 28:[1,2,3,4,5],
  29:[1,2,3,4,5], 30:[1,2,3,4,5],
}

def slug(value: str) -> str:
    text = unicodedata.normalize('NFD',value)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+','-',text.lower()).strip('-')[:75]

text = SRC.read_text(encoding='utf-8')
sourcehash = sha256(text.encode('utf-8')).hexdigest()
chapmatches = list(re.finditer(r'^# (\d{1,2})\. (.+)$',text,flags=re.M))
assert len(chapmatches)==30, f'Expected 30 chapters, got {len(chapmatches)}'
assert [int(m[1]) for m in chapmatches]==list(range(1,31)), 'Chapter sequence is broken'
assert text.count('```mermaid')>=15, 'Fewer diagrams than planned'
assert len(re.findall(r'```mermaid\n.*?```', text, re.S))==text.count('```mermaid'), 'Mermaid blocks malformed'
assert text.count('```')%2==0, 'Markdown fence parity error'

qfile = json.loads((DATA / 'QUESTOES_AIF-C01_80.json').read_text(encoding='utf-8'))
ffile = json.loads((DATA / 'FLASHCARDS_AIF-C01_120.json').read_text(encoding='utf-8'))
q = qfile['questions']
f = ffile['flashcards']
assert len(q)==80 and len(f)==120
assert Counter(x['domain'] for x in q)=={1:16,2:19,3:23,4:11,5:11}, 'Domain weight mismatch'
assert len({item['id'] for item in q})==80
assert len({item['id'] for item in f})==120
assert all(len(item['choices'])==4 and item['correct'] in 'ABCD' and len(item['explanation'])>18 for item in q)
assert all(item['id'] in text for item in q)
assert all(item['id'] in text for item in f)

chapters=[]
for index,mat in enumerate(chapmatches):
    num=int(mat[1])
    end = chapmatches[index+1].start() if index+1<len(chapmatches) else len(text)
    content=text[mat.start():end]
    module=next(mod[0] for mod in MODS if num in mod[2])
    subheadings=[]
    for sub in re.finditer(r'^(#{2,4}) ([^\n]+)$',content,re.M):
        subheadings.append({'id':f'c{num:02}-{slug(sub[2])}', 'title':sub[2], 'heading_level':len(sub[1])})
    chapters.append({'id':f'chapter-{num:02}', 'original_number':num,
       'title':mat[2], 'module_id':module, 'domains':DOMAINS[num],
       'source_heading':mat[0], 'subheadings':subheadings})

result={'metadata':{
    'generated_from':SRC.name,'sha256':sourcehash,'chapter_count':30,'question_count':80,
    'flashcard_count':120,'domain_weights':{'1':20,'2':24,'3':28,'4':14,'5':14},
    'exam_guide':'AIF-C01 v1.1 (2026-04-30)',
    'note':'Curriculum navigation metadata; the Markdown is canonical and the domain mapping is editorial.'},
    'modules':[{'id':key,'title':title,'chapter_ids':[f'chapter-{n:02}' for n in nums]} for key,title,nums in MODS],
    'chapters':chapters}
(DATA / 'CURRICULO_AIF-C01.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
with (DOCS/'AIF-C01-CONTENT_MAP.md').open('w',encoding='utf-8') as output:
    output.write(f'# Mapa do conteúdo AIF-C01\n\nOrigem: `{SRC.relative_to(ROOT)}`. SHA-256: `{sourcehash}`.\n\n')
    for mod in result['modules']:
        output.write(f"## {mod['title']}\n\n")
        for cid in mod['chapter_ids']:
            chap=next(item for item in chapters if item['id']==cid)
            output.write(f"- **{chap['original_number']:02}. {chap['title']}** → `#/cursos/aif-c01/ler/{cid}` ({len(chap['subheadings'])} seções, domínios {','.join(map(str,chap['domains']))}).\n")
        output.write('\n')
    output.write('**Prática independente:** `#/cursos/aif-c01/praticar`, 80 itens únicos; `#/cursos/aif-c01/flashcards`, 120 cartões.\n')
print('AIF-C01: chapters=',len(chapters),'sections=',sum(len(x['subheadings']) for x in chapters),
    'questions=',len(q),'flashcards=',len(f),'sha256=',sourcehash)
