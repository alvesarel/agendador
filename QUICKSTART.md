# Quick Start Guide - AI-Powered Body Analyzer

## 🚀 Day 1: Setup (30 minutes)

### 1. Create Next.js App
```bash
cd /root/agendador
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-install

# Install core dependencies
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node tailwindcss postcss autoprefixer

# Install AI SDK 5 and providers
npm install ai@latest @ai-sdk/ai-gateway @ai-sdk/google @ai-sdk/openai

# Install UI and utilities
npm install lucide-react zod
```

### 2. Environment Setup
```bash
# Create .env.local
cat > .env.local << 'EOF'
# AI Gateway (required in all environments)
AI_GATEWAY_API_KEY=your_vercel_gateway_key

# App configuration
NEXT_PUBLIC_APP_NAME="Analisador Corporal IA"
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/dr-leitner
EOF
```

> 🔐 Get your gateway key in the Vercel dashboard: AI Gateway tab → API Keys → **Create key** → copy the value into `AI_GATEWAY_API_KEY`. The gateway dashboard also shows credits, budgets, and model pricing.

### 3. Clean Project
```bash
# Remove unnecessary files
rm -rf app/fonts
rm app/favicon.ico
```

## 📁 Day 2: Core Structure (1 hour)

### 1. Create Essential Files
```bash
# Create directory structure
mkdir -p app/api/chat
mkdir -p components
mkdir -p lib

# Create core files
touch app/layout.tsx
touch app/page.tsx
touch app/api/chat/route.ts
touch components/chat.tsx
touch lib/ai.ts
```

### 2. Basic Layout
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

### 3. Homepage
```tsx
// app/page.tsx
import { Chat } from '@/components/chat'

export default function Home() {
  return (
    <main className="h-screen">
      <Chat />
    </main>
  )
}
```

## 🤖 Day 3: AI Integration (2 hours)

### 1. Configure AI Gateway & Models
```typescript
// lib/ai.ts
import { createAIGateway } from '@ai-sdk/ai-gateway'

const gateway = createAIGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
})

// Primary models routed through Vercel AI Gateway
export const chatModel = gateway.model('google/gemini-2.5-flash')
export const plannerModel = gateway.model('openai/gpt-5')
export const visionModel = gateway.model('google/gemini-2.5-pro')

export const systemPrompt = `
Você é uma nutricionista especializada em análise corporal.
Sempre responda em português brasileiro.
Seja profissional, empática e motivadora.
Quando apropriado, sugira consulta com Dr. Guilherme Leitner.
`
```

### 2. Chat API
```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'
import { chatModel, systemPrompt } from '@/lib/ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: chatModel,
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
```

### 3. Chat Component
```tsx
// components/chat.tsx
'use client'
import { useChat } from 'ai/react'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Analisador Corporal IA</h1>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map(m => (
          <div
            key={m.id}
            className={m.role === 'user' ? 'text-right' : 'text-left'}
          >
            <span className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
              m.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}
```

## 🎨 Day 4: Styling (1 hour)

### 1. Update Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#10b981',
      },
    },
  },
  plugins: [],
}
```

### 2. Global Styles
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .message-user {
    @apply bg-blue-500 text-white rounded-lg p-3;
  }

  .message-assistant {
    @apply bg-white border border-gray-200 rounded-lg p-3;
  }
}
```

## 🧮 Day 5: Calculations & Meal Plan (3 hours)

### 1. BMR/TDEE Functions
```typescript
// lib/calculations.ts
export interface UserData {
  age: number
  weight: number // kg
  height: number // cm
  gender: 'male' | 'female'
  activityLevel: number
}

export function calculateBMR(data: UserData): number {
  const { weight, height, age, gender } = data

  if (gender === 'female') {
    return 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)
  }
  return 66 + (13.7 * weight) + (5 * height) - (6.8 * age)
}

export function calculateTDEE(bmr: number, activityLevel: number): number {
  return Math.round(bmr * activityLevel)
}

export function calculateMacros(tdee: number) {
  return {
    protein: Math.round(tdee * 0.3 / 4), // 30% protein, 4 cal/g
    carbs: Math.round(tdee * 0.4 / 4),   // 40% carbs, 4 cal/g
    fat: Math.round(tdee * 0.3 / 9),     // 30% fat, 9 cal/g
  }
}
```

### 2. Integration with Chat & Meal Plan Generation
```typescript
// Add to system prompt in lib/ai.ts
export const systemPrompt = `
Você é uma nutricionista especializada.

Quando o usuário fornecer idade, peso, altura e nível de atividade:
1. Calcule o TMB (Taxa Metabólica Basal)
2. Calcule o GET (Gasto Energético Total)
3. Sugira macronutrientes adequados
4. Ofereça um plano alimentar simples

Use a fórmula de Harris-Benedict.
Níveis de atividade:
- Sedentário: 1.2
- Levemente ativo: 1.375
- Moderadamente ativo: 1.55
- Muito ativo: 1.725
`
```

```typescript
// lib/meal-plan.ts
import { generateObject } from 'ai'
import { plannerModel } from '@/lib/ai'
import { z } from 'zod'

const mealPlanSchema = z.object({
  totalCalories: z.number(),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number()
  }),
  meals: z.array(z.object({
    name: z.string(),
    time: z.string(),
    calories: z.number(),
    foods: z.array(z.object({
      item: z.string(),
      quantity: z.string(),
      calories: z.number()
    }))
  }))
})

export async function generateMealPlan(prompt: string) {
  const result = await generateObject({
    model: plannerModel,
    prompt,
    schema: mealPlanSchema,
  })

  return result.object
}
```

> ✅ Ship the meal plan experience by end of Day 5. It is required for the MVP and should be demo-ready alongside the calculations.

## 📸 Day 6: Image Upload (Optional - 3 hours)

### 1. Upload Component
```tsx
// components/upload.tsx
'use client'
import { Upload as UploadIcon } from 'lucide-react'

export function Upload({
  onUpload
}: {
  onUpload: (files: File[]) => void
}) {
  return (
    <label className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
      <UploadIcon className="w-8 h-8 text-gray-400" />
      <span className="mt-2 text-sm text-gray-600">
        Clique para enviar fotos
      </span>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          onUpload(files)
        }}
        className="hidden"
      />
    </label>
  )
}
```

### 2. Image Analysis API
```typescript
// app/api/analyze/route.ts
import { generateText } from 'ai'
import { model } from '@/lib/ai'

export async function POST(req: Request) {
  const formData = await req.formData()
  const images = formData.getAll('images') as File[]

  // Convert images to base64
  const imageData = await Promise.all(
    images.map(async (file) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      return {
        mimeType: file.type,
        data: buffer.toString('base64'),
      }
    })
  )

  const result = await generateText({
    model,
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Analise a composição corporal nestas imagens' },
        ...imageData.map(img => ({
          type: 'image' as const,
          image: img.data,
          mimeType: img.mimeType,
        }))
      ]
    }]
  })

  return Response.json({ analysis: result.text })
}
```

## 🎯 Day 7: CTAs & Polish (2 hours)

### 1. CTA Component
```tsx
// components/cta.tsx
import { Calendar } from 'lucide-react'

export function CTA() {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
      <h3 className="font-bold mb-2">
        Quer resultados mais rápidos?
      </h3>
      <p className="text-sm mb-3">
        Agende uma consulta personalizada com Dr. Guilherme Leitner
      </p>
      <a
        href={process.env.NEXT_PUBLIC_CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
      >
        <Calendar className="w-4 h-4" />
        Agendar Consulta
      </a>
    </div>
  )
}
```

### 2. Strategic Placement
```tsx
// Add to chat component
import { CTA } from './cta'

// Inside Chat component, after 5 messages:
{messages.length > 5 && <CTA />}
```

## 🚀 Deployment (30 minutes)

### 1. Build & Test
```bash
npm run build
npm run start
# Test at http://localhost:3000
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

## ✅ Launch Checklist

### Pre-Launch
- [ ] Test chat in Portuguese
- [ ] Verify calculations
- [ ] Check mobile layout
- [ ] Test Calendly link
- [ ] Review privacy notice

### Launch Day
- [ ] Deploy to production
- [ ] Set environment variables
- [ ] Test live site
- [ ] Monitor for errors
- [ ] Track first conversions

### Post-Launch
- [ ] Analyze user behavior
- [ ] Optimize CTA timing
- [ ] Improve response quality
- [ ] Add missing features
- [ ] Scale infrastructure

## 🎯 Success Metrics

### Week 1 Goals
- 100 users
- 10% conversion rate
- 5 min avg session
- < 2s response time

### Optimization Ideas
- A/B test CTA messages
- Adjust prompt timing
- Improve meal suggestions
- Add testimonials
- Create urgency

## 🆘 Troubleshooting

### Common Issues

**Chat not responding:**
```bash
# Check AI Gateway key
echo $AI_GATEWAY_API_KEY
# Check console for errors
# Verify API endpoint
```

**Slow responses:**
```text
// Verify gateway configuration and quotas in Vercel dashboard
```

**Build errors:**
```bash
# Clear cache
rm -rf .next
npm run build
```

---

Ready to build! Start with Day 1 and iterate daily. Focus on shipping, not perfection.

## 📚 Reference: Vercel AI Gateway & AI SDK 5

- **Gateway basics:** unified endpoint (`https://ai-gateway.vercel.sh/v1`) covering hundreds of models, automatic provider failover, spend monitoring, and budget controls with zero markup pricing (credits purchased through the Vercel dashboard).
- **Authentication:** use the `AI_GATEWAY_API_KEY` generated in the AI Gateway tab, or link the project to Vercel and pull an OIDC token via `vercel env pull` for short-lived automated auth.
- **Observability:** the dashboard exposes per-model usage, latency, and error metrics so you can tune routing and enforce limits.
- **AI SDK 5 highlights:** redesigned `useChat` with type-safe UI/model messages, data parts for streaming structured updates, agentic loop control, and first-class tool invocation with typed inputs/outputs.
- **Structured outputs:** combine `generateObject` with Zod schemas to keep GPT-5 meal plans typed end-to-end; use data parts to stream progress indicators back to the chat UI.
