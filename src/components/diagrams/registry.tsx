import type { ComponentType, JSX } from 'react'
import { CafWellArchitectedDiagram } from './CafWellArchitectedDiagram'
import { CaseStudyFailuresDiagram } from './CaseStudyFailuresDiagram'
import { ComputeDecisionDiagram } from './ComputeDecisionDiagram'
import { ConnectivityDiagram } from './ConnectivityDiagram'
import { DataModelDiagram } from './DataModelDiagram'
import { DisasterRecoveryDiagram } from './DisasterRecoveryDiagram'
import { Ec2LifecycleDiagram } from './Ec2LifecycleDiagram'
import { EncryptionServicesDiagram } from './EncryptionServicesDiagram'
import { IamEvaluatorDiagram } from './IamEvaluatorDiagram'
import { MessagingFlowDiagram } from './MessagingFlowDiagram'
import { MigrationRsDiagram } from './MigrationRsDiagram'
import { MultiAzReplicaDiagram } from './MultiAzReplicaDiagram'
import { ObservabilityDiagram } from './ObservabilityDiagram'
import { PricingDiagram } from './PricingDiagram'
import { RegionAzEdgeDiagram } from './RegionAzEdgeDiagram'
import { S3LifecycleDiagram } from './S3LifecycleDiagram'
import { ScalingDiagram } from './ScalingDiagram'
import { SecurityServicesDiagram } from './SecurityServicesDiagram'
import { SgNaclDiagram } from './SgNaclDiagram'
import { SharedResponsibilityDiagram } from './SharedResponsibilityDiagram'
import { StorageChooserDiagram } from './StorageChooserDiagram'
import { SyncAsyncDiagram } from './SyncAsyncDiagram'
import { VpcTopologyDiagram } from './VpcTopologyDiagram'

const diagrams: Record<string, ComponentType> = {
  'c02-2-3-escalabilidade-versus-elasticidade': ScalingDiagram,
  'c03-3-2-single-az-multi-az-e-multi-region': RegionAzEdgeDiagram,
  'c03-estrategias-comuns-de-disaster-recovery': DisasterRecoveryDiagram,
  'c04-4-3-well-architected-versus-cloud-adoption-framework': CafWellArchitectedDiagram,
  'c05-5-4-as-estrategias-7-rs-de-migracao': MigrationRsDiagram,
  'c06-6-3-a-responsabilidade-muda-conforme-o-servico': SharedResponsibilityDiagram,
  'c07-7-3-a-logica-de-autorizacao-modelo-mental-correto': IamEvaluatorDiagram,
  'c08-8-4-segredos-nao-sao-chaves-de-criptografia': EncryptionServicesDiagram,
  'c09-9-1-cloudtrail-cloudwatch-e-config-a-triade': ObservabilityDiagram,
  'c09-9-3-waf-shield-e-firewall-manager': SecurityServicesDiagram,
  'c11-estados-e-persistencia': Ec2LifecycleDiagram,
  'c11-11-6-arvore-de-decisao-onde-executar-uma-aplicacao': ComputeDecisionDiagram,
  'c12-12-4-security-groups-versus-network-acls': SgNaclDiagram,
  'c12-12-5-arquitetura-vpc-de-tres-camadas': VpcTopologyDiagram,
  'c12-12-7-conectividade-privada-e-hibrida': ConnectivityDiagram,
  'c13-exemplo-de-lifecycle': S3LifecycleDiagram,
  'c13-13-4-amazon-efs-e-amazon-fsx': StorageChooserDiagram,
  'c14-exemplo-de-dados': DataModelDiagram,
  'c14-14-5-multi-az-versus-read-replica': MultiAzReplicaDiagram,
  'c16-exemplo-exportacao-de-planilha': SyncAsyncDiagram,
  'c16-16-7-escolha-por-intencao': MessagingFlowDiagram,
  'c19-19-3-tabela-resumo-de-compras': PricingDiagram,
  'c21-21-4-falhas-simuladas-e-resposta-correta': CaseStudyFailuresDiagram,
}

export const DIAGRAM_SECTION_IDS = Object.keys(diagrams)

export function DiagramSlot({ sectionId }: { sectionId: string }): JSX.Element | null {
  const Diagram = diagrams[sectionId]
  if (!Diagram) {
    return null
  }
  return <Diagram />
}
