const REVIEW_SERVICE_NAMES = [
  'AWS Certificate Manager (ACM)',
  'Application Load Balancer (ALB)',
  'AWS Database Migration Service (AWS DMS)',
  'AWS Elastic Disaster Recovery (AWS DRS)',
  'Amazon Elastic Block Store (EBS)',
  'Amazon Elastic Compute Cloud (EC2)',
  'Amazon Elastic Container Registry (ECR)',
  'Amazon Elastic Container Service (ECS)',
  'Amazon Elastic File System (EFS)',
  'Amazon Elastic Kubernetes Service (EKS)',
  'Elastic Load Balancing (ELB)',
  'Amazon Elastic MapReduce (Amazon EMR; nome que originou a sigla)',
  'AWS Identity and Access Management (IAM)',
  'AWS Key Management Service (AWS KMS)',
  'Amazon Relational Database Service (RDS)',
  'AWS Resource Access Manager (AWS RAM)',
  'Amazon Simple Storage Service (S3)',
  'AWS Schema Conversion Tool (AWS SCT)',
  'Amazon Simple Email Service (Amazon SES)',
  'Amazon Simple Notification Service (Amazon SNS)',
  'Amazon Simple Queue Service (Amazon SQS)',
  'AWS Security Token Service (AWS STS)',
  'Amazon Virtual Private Cloud (VPC)',
  'AWS Web Application Firewall (AWS WAF)',
]

const INDEX_SERVICE_NAMES = [
  'AWS Identity and Access Management (IAM)',
  'Amazon Elastic Compute Cloud (EC2)',
  'Amazon Virtual Private Cloud (VPC)',
  'Amazon Simple Storage Service (S3)',
  'Amazon Elastic Block Store (EBS)',
  'Amazon Elastic File System (EFS)',
]

function split(item: string): { abbr: string; full: string } {
  const match = /^(.*?) \(([^;)]+?)(?:;[^)]*)?\)$/.exec(item)
  return match ? { full: match[1]!, abbr: match[2]! } : { full: item, abbr: item }
}

export function ServiceNamesGuide({ scope = 'review', names: given }: { scope?: 'review' | 'index'; names?: readonly { abbr: string; full: string }[] }) {
  const names = given ?? (scope === 'index' ? INDEX_SERVICE_NAMES : REVIEW_SERVICE_NAMES).map(split)
  return (
    <details className="names-guide">
      <summary>Siglas usadas nesta página · {names.length}</summary>
      <dl>
        {names.map(({ abbr, full }) => (
          <div key={abbr}>
            <dt>{abbr}</dt>
            <dd>{full}</dd>
          </div>
        ))}
      </dl>
    </details>
  )
}
