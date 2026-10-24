#!/usr/bin/env python3
"""Create 24 original AIF-C01 exercises for question formats beyond single choice.
Not wired into the React test bank. Editorial review and UI support are required.
"""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parent.parent
entries=[]

def mr(domain,task,prompt,choices,correct,explanation):
    idx=1+sum(x['type']=='multiple_response' for x in entries)
    entries.append(dict(id=f'AIF-MR{idx:02}', type='multiple_response', domain=domain, task=task,
        prompt=prompt, choices=[dict(id='ABCDE'[i],text=c) for i,c in enumerate(choices)],
        number_to_select=len(correct), correct=list(correct), explanation=explanation))

def order(domain,task,prompt,steps,explanation):
    idx=1+sum(x['type']=='ordering' for x in entries)
    items=[dict(id=f'S{i+1}',text=x) for i,x in enumerate(steps)]
    display=items[::2][::-1]+items[1::2]  # intentionally out of order; deterministic
    entries.append(dict(id=f'AIF-ORD{idx:02}', type='ordering', domain=domain, task=task,
        prompt=prompt, steps=display, correct_order=[item['id'] for item in items],explanation=explanation))

def match(domain,task,prompt,pairs,explanation):
    idx=1+sum(x['type']=='matching' for x in entries)
    left=[dict(id=f'L{i+1}',text=a) for i,(a,b) in enumerate(pairs)]
    right=[dict(id=f'R{i+1}',text=b) for i,(a,b) in enumerate(pairs)]
    entries.append(dict(id=f'AIF-MAT{idx:02}',type='matching',domain=domain,task=task,
        prompt=prompt,left=left,right=list(reversed(right)),
        correct_matches={f'L{i+1}':f'R{i+1}' for i in range(len(pairs))},explanation=explanation))

# MULTIPLE RESPONSE (5 options; 2 or 3 correct)
mr(1,'1.2','Uma empresa quer prever a probabilidade de inadimplência a partir de dados tabulares rotulados, com explicações auditáveis. Selecione as DUAS decisões mais razoáveis.',[
    'Começar com uma baseline de regressão logística ou árvore e avaliar os resultados.',
    'Escolher obrigatoriamente um LLM generalista apenas por ser maior.',
    'Medir precisão e recall por segmento e verificar vieses antes de usar o resultado.',
    'Dispensar validação porque os exemplos foram rotulados.',
    'Permitir que um chatbot aprove crédito sozinho sem controles de negócio.' ],'AC','O problema é preditivo e estruturado. Uma baseline clássica e avaliação por segmento são decisões justificáveis; tamanho do LLM não implica adequação nem segurança.')
mr(1,'1.3','Fraudes confirmadas são raras e o conjunto é muito desbalanceado. Escolha as DUAS métricas que ajudam a interpretar erros relevantes para a classe fraude.',[
    'Número de tokens emitidos pelo prompt.',
    'Recall da classe fraude.',
    'Quantidade de imagens geradas.',
    'Precision da classe fraude.',
    'Apenas accuracy agregada sem matriz de confusão.' ],'BD','Recall indica quantas fraudes foram encontradas; precision indica quantos alertas de fraude são realmente fraudes. Accuracy isolada pode esconder falhas em classes raras.')
mr(2,'2.1','Ao projetar uma chamada de foundation model, quais DUAS afirmações sobre tokens e contexto são válidas?',[
    'Uma janela de contexto tem tamanho infinito em modelos atuais.',
    'Adicionar conteúdo irrelevante ao prompt garante precisão maior.',
    'Tokens de entrada e saída podem influenciar o custo conforme o modelo de cobrança.',
    'Mais contexto nem sempre é melhor; pode elevar custo e dificultar recuperar instruções importantes.',
    'O número de tokens de saída é sempre igual ao de caracteres.' ],'CD','Uso de tokens afeta preço e desempenho conforme a oferta. Contexto deve ser selecionado, relevante e limitado para sustentar a tarefa.')
mr(2,'2.1','Um agente usa ferramentas externas por MCP. Selecione DUAS boas práticas para reduzir riscos ao executar ações.',[
    'Aplicar autorização real no serviço que executa a ferramenta e restringir o escopo.',
    'Assumir que o protocolo MCP já garante permissão e ausência de ataques.',
    'Pedir revisão humana para operações de impacto quando exigido pelo risco.',
    'Tratar o retorno de qualquer ferramenta como instrução de sistema confiável.',
    'Compartilhar credenciais administrativas com todas as ferramentas para simplificar.' ],'AC','MCP padroniza integração, mas não substitui IAM e controles de aplicação. Ações críticas podem exigir aprovação humana e logging.')
mr(3,'3.1','Uma equipe precisa responder sobre políticas internas que mudam toda semana. Quais DUAS escolhas ajudam a construir uma solução fundamentada?',[
    'Treinar um novo foundation model do zero toda vez que um documento mudar.',
    'Indexar documentos autorizados e recuperar trechos relevantes na consulta via RAG.',
    'Ignorar permissões documentais pois o modelo apenas resume.',
    'Disponibilizar referências e verificar se a resposta está apoiada no conteúdo recuperado.',
    'Supor que usar RAG elimina totalmente alucinações.' ],'BD','RAG injeta evidências atualizadas no contexto. Permissões e grounding continuam necessários; nenhuma técnica garante veracidade absoluta.')
mr(3,'3.4','Você avalia um assistente RAG que cita documentos. Quais DUAS dimensões ajudam a diagnosticar sua qualidade além de fluência?',[
    'Relevância dos trechos recuperados para a pergunta.',
    'Somente número de parâmetros do modelo.',
    'Se a resposta é sustentada pelos trechos e suas citações.',
    'Somente cor do botão de enviar mensagem.',
    'Quantidade máxima de requisições sem observar resultado.' ],'AC','Uma resposta pode soar boa mesmo quando a recuperação é ruim ou o texto inventa afirmações. Meça retrieval e grounding separadamente.')
mr(4,'4.2','Uma empresa avalia IA para sugerir decisões sensíveis. Selecione TRÊS mecanismos coerentes com IA responsável.',[
    'Documentar dados, uso pretendido, limitações e métricas com artefatos como Model Cards.',
    'Examinar desempenho e efeitos para diferentes subgrupos relevantes.',
    'Dispensar explicação e contestação porque o modelo tem boa média global.',
    'Oferecer revisão ou contestação humana de decisões de alto impacto.',
    'Usar apenas resultados de demonstrações comerciais como auditoria suficiente.' ],'ABD','Documentação, testes por subgrupos e supervisão humana tratam responsabilidades distintas. Média global e demo não bastam.')
mr(5,'5.1','Ao integrar um agente com um sistema financeiro, quais TRÊS proteções são compatíveis com defesa em profundidade?',[
    'Permissões de mínimo privilégio e autenticação na ferramenta/serviço.',
    'Validação de parâmetros e do resultado antes de efetuar ações.',
    'Permitir toda ação se a resposta do modelo vier em JSON válido.',
    'Auditoria de chamadas de ferramenta e aprovação humana para operações críticas.',
    'Inserir segredos diretamente em prompts para economizar configuração.' ],'ABD','IAM, validação, logs e aprovações são controles independentes. Formato JSON não equivale a autorização nem correção.')

# ORDERING (3–5 steps, all conceptual; bundled step labels are part of the answer)
order(1,'1.3','Coloque em ordem um ciclo simplificado e auditável de entrega de ML, do planejamento ao uso.',[
    'Definir problema, público, restrições e métrica de sucesso.',
    'Coletar e preparar dados representativos com tratamento de qualidade e vazamentos.',
    'Treinar um baseline com dados apropriados.',
    'Avaliar resultados no conjunto de teste e revisar riscos.',
    'Implantar com monitoramento, feedback e plano de atualização.' ],'Definir a tarefa antes de tocar nos dados evita selecionar métrica ou técnica equivocada. Avaliar precede decisão de implantação; monitorar vem após o uso.')
order(1,'1.2','Uma empresa começa a estudar classificação de solicitações. Ordene as decisões desde o problema até o piloto.',[
    'Delimitar categorias e resultado de negócio desejado.',
    'Examinar volume, rótulos disponíveis e representatividade dos exemplos.',
    'Comparar uma solução determinística ou baseline de ML conforme necessidade.',
    'Definir métricas e testar erros em dados não usados no treinamento.',
    'Executar piloto controlado e coletar feedback dos usuários.' ],'O método depende de objetivo e dados. Piloto não deve preceder avaliação em dados representativos.')
order(2,'2.1','Ordene a preparação de uma solicitação GenAI controlada, antes de exibir a resposta ao usuário.',[
    'Receber a solicitação e verificar autenticação/limites pertinentes.',
    'Selecionar instruções, contexto autorizado e restrições da tarefa.',
    'Solicitar inferência ao modelo.',
    'Validar a resposta quanto a formato, segurança e pertinência.',
    'Exibir a resposta e registrar telemetria apropriada.' ],'Em fluxo simplificado, controle de entrada antecede inferência e validação de saída antecede a apresentação. Sistemas reais podem intercalar outros controles.')
order(3,'3.1','Ordene o percurso de CONSULTA em uma aplicação RAG que usa índice vetorial já criado.',[
    'Receber e normalizar a pergunta do usuário.',
    'Gerar uma representação de busca (por exemplo embedding da pergunta).',
    'Recuperar trechos relevantes do repositório autorizado.',
    'Combinar pergunta, instruções e evidências no contexto.',
    'Gerar e validar a resposta, exibindo fontes quando disponíveis.' ],'O RAG recupera evidências antes da geração. Indexação dos documentos ocorre separadamente, na preparação do acervo.')
order(3,'3.2','Ordene um processo de melhoria de prompt com histórico reproduzível.',[
    'Definir tarefa, formato esperado e condições de sucesso.',
    'Criar a versão inicial do prompt com restrições e exemplos necessários.',
    'Executar um conjunto consistente de casos de teste.',
    'Analisar erros, custo, riscos e desempenho frente à versão anterior.',
    'Versionar a configuração escolhida e acompanhar resultados em uso.' ],'Iterar sem objetivo, teste fixo e registro de versão dificulta saber se o prompt realmente melhorou.')
order(3,'3.4','Ordene uma avaliação de agente antes de ampliar seu acesso a ferramentas.',[
    'Definir quais tarefas e ações são permitidas e o que caracteriza sucesso.',
    'Construir cenários de teste normais, adversariais e de falha de ferramenta.',
    'Executar o agente com ferramentas em ambiente controlado.',
    'Avaliar conclusão da tarefa, segurança, intervenção humana e custos.',
    'Corrigir falhas e aplicar critérios de aprovação antes de expandir o uso.' ],'Avalie comportamento de ponta a ponta, não apenas a qualidade do texto. Testes de limites e permissões são essenciais em agentes com ferramentas.')
order(4,'4.1','Ordene um ciclo de análise de justiça para um caso de decisão com IA.',[
    'Identificar público afetado e riscos de decisão desigual.',
    'Examinar origem, distribuição e qualidade dos dados por subgrupo relevante.',
    'Definir métricas adequadas e avaliar resultados por subgrupo.',
    'Mitigar distorções, documentar trade-offs e reavaliar.',
    'Monitorar em produção e abrir canais de revisão/contestação.' ],'Um score agregado não revela resultados desiguais. As métricas e a mitigação dependem do contexto e das pessoas afetadas.')
order(5,'5.2','Ordene a criação de um processo de governança para um novo caso de uso de IA.',[
    'Inventariar finalidade, responsáveis, sistemas e dados utilizados.',
    'Classificar riscos, sensibilidade, requisitos legais e impacto da aplicação.',
    'Definir controles, aprovações, retenção e políticas de acesso.',
    'Instrumentar logs, auditoria, acompanhamento e evidências.',
    'Revisitar periodicamente a adequação dos controles e as mudanças do sistema.' ],'Governança começa conhecendo ativos e riscos, estabelece controles e exige evidência e revisão contínua.')

# MATCHING (four pairs per question)
match(1,'1.1','Associe cada tipo de aprendizado ao exemplo mais característico.',[
    ('Classificação supervisionada','Prever se um e-mail é spam usando exemplos rotulados.'),
    ('Regressão supervisionada','Estimar um valor numérico a partir de histórico rotulado.'),
    ('Clustering não supervisionado','Formar grupos semelhantes sem rótulos de grupos prontos.'),
    ('Aprendizado por reforço','Aprender uma política de ações a partir de recompensas.'),
],'O tipo de saída e a presença de rótulos/recompensas ajudam a identificar o paradigma.')
match(1,'1.2','Associe os serviços AWS de IA especializada a suas funções principais.',[
    ('Amazon Comprehend','Extrair informações e entidades de texto com NLP.'),
    ('Amazon Textract','Extrair texto e estrutura de documentos escaneados.'),
    ('Amazon Transcribe','Converter fala em texto.'),
    ('Amazon Translate','Traduzir texto entre idiomas.'),
],'Os nomes têm funções próximas, mas a modalidade de entrada/saída muda a escolha.')
match(2,'2.1','Associe os conceitos básicos de foundation models às descrições.',[
    ('Token','Unidade usada pelo modelo para representar porções de texto ou outras modalidades.'),
    ('Embedding','Representação vetorial de informação para comparação/recuperação.'),
    ('Janela de contexto','Limite de informação que pode ser considerada na chamada, conforme modelo.'),
    ('Temperatura','Parâmetro que influencia a aleatoriedade da amostragem, conforme modelo.'),
],'Tokenização, recuperação e geração são conceitos diferentes; embeddings não são resposta pronta.')
match(2,'2.3','Associe a necessidade ao produto/serviço AWS mais diretamente ligado a ela.',[
    ('Amazon Bedrock','Consumir foundation models e recursos gerenciados de GenAI.'),
    ('Amazon SageMaker AI','Criar e operar fluxos de machine learning com maior controle do ciclo de vida.'),
    ('Amazon Polly','Converter texto em fala sintetizada.'),
    ('Amazon Rekognition','Analisar conteúdo de imagens e vídeos.'),
],'Uma mesma solução pode usar vários serviços; associe o propósito principal de cada um.')
match(3,'3.1','Associe a técnica de adaptação de aplicação de FM à mudança que ela efetivamente faz.',[
    ('RAG','Fornece contexto recuperado na consulta sem exigir mudar os pesos do modelo.'),
    ('Fine-tuning','Atualiza parâmetros do modelo para adaptá-lo por treinamento adicional.'),
    ('Destilação','Treina um modelo aluno para reproduzir capacidades/comportamento do professor em um escopo.'),
    ('In-context learning','Orienta comportamento com exemplos no contexto, sem alterar os pesos.'),
],'RAG e in-context learning alteram entradas; fine-tuning e destilação envolvem treinamento.')
match(3,'3.4','Associe a métrica à finalidade mais adequada em avaliação.',[
    ('BLEU','Comparar correspondência de n-gramas, tradicionalmente em tradução.'),
    ('ROUGE','Analisar sobreposição de texto, frequentemente em sumarização.'),
    ('BERTScore','Comparar similaridade semântica baseada em representações contextuais.'),
    ('Taxa de conclusão da tarefa','Medir se o fluxo resolveu a ação de negócio definida.'),
],'Métricas textuais não substituem avaliação do resultado de negócio nem revisão de segurança.')
match(4,'4.2','Associe cada expressão à preocupação de IA responsável.',[
    ('Viés algorítmico','Padrão de resultado desigual potencialmente prejudicial entre grupos.'),
    ('Alucinação','Saída plausível que apresenta afirmação não sustentada como se fosse fato.'),
    ('Explicabilidade','Capacidade de dar justificativas compreensíveis para comportamento/resultado.'),
    ('Humano no loop','Intervenção humana em pontos definidos de avaliação ou decisão.'),
],'São riscos/controles relacionados, mas independentes: um modelo explicável ainda pode ter viés.')
match(5,'5.1','Associe o serviço AWS ao controle ou evidência principal.',[
    ('AWS IAM','Autorização de ações e recursos por papéis e políticas.'),
    ('AWS KMS','Gerenciamento de chaves de criptografia.'),
    ('AWS CloudTrail','Registro/auditoria de atividade de API e eventos suportados.'),
    ('AWS Artifact','Acesso a relatórios de conformidade e acordos de terceiros da AWS.'),
],'Controle de identidade, chaves, registro de eventos e documentação de conformidade não são substitutos.')

assert len(entries)==24
assert len({x['id'] for x in entries})==len(entries)
assert {t:sum(q['type']==t for q in entries) for t in ('multiple_response','ordering','matching')} == {'multiple_response':8,'ordering':8,'matching':8}
assert set(q['task'] for q in entries) <= {'1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3','3.4','4.1','4.2','5.1','5.2'}
for e in entries:
    if e['type']=='multiple_response':
        assert 2<=len(e['correct'])<=3
        assert len(e['choices'])==5
        assert set(e['correct']) <= {c['id'] for c in e['choices']}
    elif e['type']=='ordering':
        assert len(e['steps'])==5
        assert set(e['correct_order'])=={s['id'] for s in e['steps']}
        assert [s['id'] for s in e['steps']]!=e['correct_order']
    else:
        assert len(e['left'])==len(e['right'])==4
        assert set(e['correct_matches'])=={x['id'] for x in e['left']}
        assert set(e['correct_matches'].values())=={x['id'] for x in e['right']}

out=ROOT/'data/QUESTOES_AIF-C01_FORMATOS_COMPLEMENTARES_24.json'
out.write_text(json.dumps({'exam':'AIF-C01','authorial':True,'status':'proposta-para-revisao-e-integracao','count':24,
    'note':'24 exercicios adicionais autorais. Ainda NAO integram o banco principal nem o simulado. Revise tecnicamente e implemente UI/avaliacao destes formatos antes de anunciar como funcionalidades.',
    'questions':entries},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

lines=['# Exercícios suplementares AIF-C01 — formatos não contemplados pelo protótipo','',
       '**Status:** 24 itens originais propostos (8 múltipla resposta, 8 ordenação, 8 associação). **Não estão integrados ao simulado React**. Revisar antes de publicar. As questões ilustram formatos admitidos pelo guia, mas não são itens oficiais nem reproduzem a dificuldade psicométrica da prova.','']
for e in entries:
    lines += [f"## {e['id']} — {e['type']} · Domínio {e['domain']} · Tarefa {e['task']}",'',e['prompt'],'']
    if e['type']=='multiple_response':
        lines += [f"- **{o['id']}.** {o['text']}" for o in e['choices']]
        lines += ['', f"**Gabarito ({e['number_to_select']} opções):** {', '.join(e['correct'])}"]
    elif e['type']=='ordering':
        lines += [f"- **{o['id']}.** {o['text']}" for o in e['steps']]
        lines += ['',f"**Ordem correta:** {' → '.join(e['correct_order'])}"]
    else:
        lines += ['**Conceitos:**']+[f"- **{o['id']}:** {o['text']}" for o in e['left']]
        lines += ['','**Definições:**']+[f"- **{o['id']}:** {o['text']}" for o in e['right']]
        lines += ['', '**Associações corretas:** '+', '.join(f'{a} → {b}' for a,b in e['correct_matches'].items())]
    lines += ['',f"**Por quê:** {e['explanation']}",'','---','']
(ROOT/'content/QUESTOES_AIF-C01_FORMATOS_COMPLEMENTARES.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('Generated',len(entries),'supplemental questions:',out)
