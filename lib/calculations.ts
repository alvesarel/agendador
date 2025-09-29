export const ACTIVITY_LEVELS = {
  sedentary: {
    factor: 1.2,
    title: 'Sedentário',
    description: 'Pouca ou nenhuma atividade física semanal'
  },
  light: {
    factor: 1.375,
    title: 'Levemente ativo',
    description: 'Exercícios leves 1-3 vezes por semana'
  },
  moderate: {
    factor: 1.55,
    title: 'Moderadamente ativo',
    description: 'Exercícios moderados 3-5 vezes por semana'
  },
  active: {
    factor: 1.725,
    title: 'Muito ativo',
    description: 'Treinos intensos 6-7 vezes por semana'
  },
  veryActive: {
    factor: 1.9,
    title: 'Extremamente ativo',
    description: 'Treino intenso diário combinado com trabalho físico'
  }
} as const

export type ActivityLevel = keyof typeof ACTIVITY_LEVELS

export interface UserMetricsInput {
  age: number
  height: number // cm
  weight: number // kg
  gender: 'female' | 'male'
  activityLevel: ActivityLevel
  goal: 'cutting' | 'maintenance' | 'bulking'
}

export interface MacroBreakdown {
  protein: number
  carbs: number
  fat: number
}

export interface MetricsResult {
  bmr: number
  tdee: number
  macros: MacroBreakdown
}

export function calculateBMR({
  age,
  height,
  weight,
  gender
}: Pick<UserMetricsInput, 'age' | 'height' | 'weight' | 'gender'>): number {
  const base = gender === 'female'
    ? 655 + 9.6 * weight + 1.8 * height - 4.7 * age
    : 66 + 13.7 * weight + 5 * height - 6.8 * age

  return Math.round(base)
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const factor = ACTIVITY_LEVELS[activityLevel].factor
  return Math.round(bmr * factor)
}

export function adjustCaloriesForGoal(tdee: number, goal: UserMetricsInput['goal']): number {
  switch (goal) {
    case 'cutting':
      return Math.round(tdee * 0.85)
    case 'bulking':
      return Math.round(tdee * 1.15)
    default:
      return tdee
  }
}

export function calculateMacros(calories: number, goal: UserMetricsInput['goal']): MacroBreakdown {
  const macroSplits: Record<UserMetricsInput['goal'], MacroBreakdown> = {
    cutting: {
      protein: 0.35,
      carbs: 0.35,
      fat: 0.3
    },
    maintenance: {
      protein: 0.3,
      carbs: 0.4,
      fat: 0.3
    },
    bulking: {
      protein: 0.25,
      carbs: 0.5,
      fat: 0.25
    }
  }

  const split = macroSplits[goal]

  return {
    protein: Math.round((calories * split.protein) / 4),
    carbs: Math.round((calories * split.carbs) / 4),
    fat: Math.round((calories * split.fat) / 9)
  }
}

export function computeMetrics(input: UserMetricsInput): MetricsResult {
  const bmr = calculateBMR(input)
  const maintenanceTdee = calculateTDEE(bmr, input.activityLevel)
  const goalCalories = adjustCaloriesForGoal(maintenanceTdee, input.goal)

  return {
    bmr,
    tdee: goalCalories,
    macros: calculateMacros(goalCalories, input.goal)
  }
}
