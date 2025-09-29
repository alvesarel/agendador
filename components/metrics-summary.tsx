import type { MetricsResult, UserMetricsInput } from '@/lib/calculations'

interface MetricsSummaryProps {
  input: UserMetricsInput
  summary: MetricsResult
}

export function MetricsSummary({ input, summary }: MetricsSummaryProps) {
  const { bmr, tdee, macros } = summary

  return (
    <section className="mt-6 space-y-4">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">Resumo da análise metabólica</h3>
        <p className="text-sm text-gray-600">
          Esses valores servem como base para recomendações personalizadas de alimentação e treino.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="TMB" subtitle="Taxa Metabólica Basal" value={`${bmr} kcal`} description="Energia mínima para manter funções vitais" />
        <StatCard
          title="Calorias diárias"
          subtitle={goalLabel(input.goal)}
          value={`${tdee} kcal`}
          description="Quantidade estimada para atingir seu objetivo"
        />
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700">Distribuição de macronutrientes</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>
              <span className="font-medium">Proteínas:</span> {macros.protein}g
            </li>
            <li>
              <span className="font-medium">Carboidratos:</span> {macros.carbs}g
            </li>
            <li>
              <span className="font-medium">Gorduras:</span> {macros.fat}g
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function StatCard({
  title,
  subtitle,
  value,
  description
}: {
  title: string
  subtitle: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className="text-xs font-semibold uppercase text-blue-600">{title}</span>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-700">{subtitle}</p>
      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
  )
}

function goalLabel(goal: UserMetricsInput['goal']) {
  switch (goal) {
    case 'cutting':
      return 'Déficit calórico para definição'
    case 'bulking':
      return 'Superávit calórico para hipertrofia'
    default:
      return 'Manutenção do peso corporal'
  }
}
