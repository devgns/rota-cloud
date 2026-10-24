import type { ComponentType } from 'react'
import { AgentRisksQuiz } from './AgentRisksQuiz'
import { AgentRunDiagram } from './AgentRunDiagram'
import { AiNestingDiagram } from './AiNestingDiagram'
import { AppEvaluationDiagram } from './AppEvaluationDiagram'
import { AiServicesIODiagram, DataPipelineDiagram } from './AiServicesIODiagram'
import { AwsAiPortfolioDiagram } from './AwsAiPortfolioDiagram'
import { CaseStudyArchitectureDiagram } from './CaseStudyArchitectureDiagram'
import { ComparePairsDiagram, ExamCluesQuiz } from './ComparePairsDiagram'
import { ConfusionMatrixDiagram } from './ConfusionMatrixDiagram'
import { ContextBudgetDiagram, EmbeddingSpaceDiagram } from './ContextDiagrams'
import { CoverageMapDiagram, DependencyTrailDiagram } from './CoverageMapDiagram'
import { CostPerTaskDiagram, ProvisionedBreakEvenDiagram } from './CostDiagrams'
import { CustomizationLadderDiagram } from './CustomizationLadderDiagram'
import { DefenseInDepthDiagram } from './DefenseInDepthDiagram'
import { EvalLayersDiagram, TextMetricsDiagram } from './EvaluationDiagrams'
import { ExamBlueprintDiagram } from './ExamBlueprintDiagram'
import { DataLifecycleRingDiagram, GovernanceServicesQuiz } from './GovernanceDiagrams'
import { GenerationParamsDiagram, RoutingCostDiagram } from './InferenceDiagrams'
import { DataSplitDiagram, LearningParadigmsDiagram } from './LearningParadigmsDiagram'
import { InferenceModesQuiz, MlLifecycleDiagram } from './MlLifecycleDiagram'
import { DiffusionDiagram, ModalityMatrixDiagram } from './ModalityDiagrams'
import { FmLifecycleDiagram, NextTokenDiagram } from './NextTokenDiagram'
import { DomainMixDiagram, EvalLabExercise, FlashDeckPreview, StudyPlanDiagram } from './PracticeDiagrams'
import { PromptBuilderDiagram } from './PromptBuilderDiagram'
import { RagFilterDiagram, RagOrFineTuneQuiz, RagPipelineDiagram } from './RagDiagrams'
import { BiasVarianceDiagram, FairnessSubgroupDiagram, HumanOversightDiagram, ResponsibleTraitsQuiz, TransparencyQuiz } from './ResponsibleAiDiagrams'
import { ControlsMatrixDiagram, SharedResponsibilityAiDiagram } from './SecurityControlsDiagrams'
import { ServiceCatalogExplorer, ServiceClassificationQuiz } from './ServiceCatalogExplorer'
import { TechniquePickerDiagram } from './TechniquePickerDiagram'

export interface AifDiagramEntry {
  component: ComponentType
  /** Ocupa o lugar do bloco Mermaid da seção, em vez de vir depois dela. */
  replacesMermaid?: boolean
}

/** Diagramas por id de seção (cNN-slug) ou de abertura (cNN-abertura). */
const after = (component: ComponentType): AifDiagramEntry => ({ component })
const inPlace = (component: ComponentType): AifDiagramEntry => ({ component, replacesMermaid: true })

const diagrams: Record<string, readonly AifDiagramEntry[]> = {
  // Comece aqui e fundamentos de ML
  'c01-1-1-que-competencia-esta-certificacao-mede': [after(ExamBlueprintDiagram)],
  'c02-2-1-comece-pelo-problema-maquinas-que-executam-tarefas-inteligentes': [inPlace(AiNestingDiagram)],
  'c03-3-2-tres-paradigmas-de-aprendizado': [inPlace(LearningParadigmsDiagram)],
  'c03-3-3-conjuntos-de-treinamento-validacao-e-teste': [after(DataSplitDiagram)],
  'c04-4-2-matriz-de-tecnicas': [after(TechniquePickerDiagram)],
  'c05-5-1-da-hipotese-ao-sistema-que-continua-funcionando': [inPlace(MlLifecycleDiagram)],
  'c05-5-2-treino-inferencia-e-modalidades-de-atendimento': [after(InferenceModesQuiz)],
  'c06-6-4-exemplo-resolvido-a-matriz-de-confusao-da-triagem-de-risco': [after(ConfusionMatrixDiagram)],
  'c07-7-1-a-pergunta-da-prova-costuma-vir-como-uma-necessidade': [after(AiServicesIODiagram)],
  'c07-7-2-o-que-analytics-acrescenta-ao-ml': [inPlace(DataPipelineDiagram)],
  // Como funciona a IA generativa
  'c08-8-2-como-o-transformer-aprende-a-produzir-texto': [inPlace(NextTokenDiagram)],
  'c08-8-3-ciclo-de-vida-de-um-fm': [after(FmLifecycleDiagram)],
  'c09-9-1-token-nao-e-necessariamente-palavra': [after(ContextBudgetDiagram)],
  'c09-9-2-o-que-e-embedding': [inPlace(EmbeddingSpaceDiagram)],
  'c10-10-1-nem-toda-ia-generativa-produz-texto': [after(ModalityMatrixDiagram), after(DiffusionDiagram)],
  'c11-11-2-parametros-de-geracao': [after(GenerationParamsDiagram)],
  'c11-11-5-decisao-por-cenario-latencia-qualidade-e-tokens': [after(RoutingCostDiagram)],
  // Construindo aplicações com FMs
  'c12-12-4-arquitetura-orientadora': [inPlace(AwsAiPortfolioDiagram)],
  'c13-13-3-engenharia-de-contexto-em-aplicacoes-reais': [inPlace(PromptBuilderDiagram)],
  'c14-14-2-duas-etapas-dois-tipos-de-risco': [inPlace(RagPipelineDiagram)],
  'c14-14-4-rag-ou-fine-tuning': [after(RagOrFineTuneQuiz)],
  'c14-14-6-rag-em-detalhes-o-que-acontece-antes-e-depois-da-consulta': [after(RagFilterDiagram)],
  'c15-15-1-de-responder-para-executar-um-trabalho': [inPlace(AgentRunDiagram)],
  'c15-15-6-quatro-riscos-que-a-prova-quer-que-voce-enxergue': [after(AgentRisksQuiz)],
  'c16-16-4-destilacao-e-eficiencia': [inPlace(CustomizationLadderDiagram)],
  'c17-17-2-avaliar-o-fm-e-avaliar-a-aplicacao-sao-tarefas-diferentes': [inPlace(AppEvaluationDiagram)],
  'c17-17-3-metricas-textuais-que-podem-aparecer-no-exame': [after(TextMetricsDiagram)],
  'c17-17-5-estruture-uma-bateria-de-avaliacao-que-encontre-falhas-escondidas': [after(EvalLayersDiagram)],
  'c18-18-1-contar-apenas-o-preco-do-modelo-esconde-o-custo-real': [after(CostPerTaskDiagram)],
  'c18-18-2-custos-variaveis-e-previsibilidade': [after(ProvisionedBreakEvenDiagram)],
  // IA responsável, segurança e governança
  'c19-19-1-a-pergunta-nao-e-apenas-o-modelo-acerta': [after(ResponsibleTraitsQuiz)],
  'c19-19-2-fontes-de-vies': [after(FairnessSubgroupDiagram)],
  'c19-19-3-vies-variancia-overfit-e-underfit': [after(BiasVarianceDiagram)],
  'c20-20-1-transparencia-e-explicabilidade-sao-perguntas-diferentes': [after(TransparencyQuiz)],
  'c20-20-4-design-centrado-no-humano': [after(HumanOversightDiagram)],
  'c21-21-3-uma-defesa-em-camadas': [inPlace(DefenseInDepthDiagram)],
  'c22-22-3-responsabilidade-compartilhada-e-genai': [after(SharedResponsibilityAiDiagram)],
  'c22-22-6-matriz-de-controles-quem-protege-o-que': [after(ControlsMatrixDiagram)],
  'c23-23-2-diferenciando-servicos-que-a-prova-aproxima': [after(GovernanceServicesQuiz)],
  'c23-23-4-ciclo-de-vida-de-dados-e-politicas': [after(DataLifecycleRingDiagram)],
  // Revisão, prática e referência
  'c24-24-1-como-usar-este-capitulo': [after(ServiceCatalogExplorer)],
  'c24-24-8-exercicio-de-classificacao': [after(ServiceClassificationQuiz)],
  'c25-25-2-arquitetura-conceitual': [inPlace(CaseStudyArchitectureDiagram)],
  'c26-26-1-aprenda-pela-diferenca-nao-apenas-pela-definicao': [after(ComparePairsDiagram)],
  'c26-26-2-se-o-enunciado-contiver-estas-pistas': [after(ExamCluesQuiz)],
  'c27-abertura': [after(DomainMixDiagram)],
  'c28-abertura': [after(FlashDeckPreview)],
  'c29-29-2-laboratorio-de-avaliacao-o-modelo-eloquente-que-errou': [after(EvalLabExercise)],
  'c29-29-4-cronograma-de-quatro-semanas': [after(StudyPlanDiagram)],
  'c30-30-1-como-interpretar-este-mapa': [after(CoverageMapDiagram)],
  'c30-30-2-trilha-por-dependencia-conceitual': [inPlace(DependencyTrailDiagram)],
}

export const AIF_DIAGRAM_SECTION_IDS = Object.keys(diagrams)

export function diagramsFor(id: string): readonly AifDiagramEntry[] {
  return diagrams[id] ?? []
}
