# CLAUDE.md - Project Context & Instructions (Ground-Up Approach)

## Project Overview
**Name:** AI Body Composition Analyzer (Analisador Corporal IA)
**Purpose:** Lead generation tool for Dr. Guilherme Leitner's consultation services
**Target Audience:** Brazilian women, 35-55 years old, upper-class, seeking body transformation
**Language:** Brazilian Portuguese (all UI/UX)
**Development Approach:** Ground-up implementation with AI Gateway for unified provider management
**Status:** Starting fresh implementation

## Core Technology Stack (UPDATED)

### AI/ML Stack
- **AI SDK:** Vercel AI SDK 5 (Production-ready, GA)
- **Gateway:** Vercel AI Gateway (Production-ready, Zero markup pricing)
- **Primary Model:** Google Gemini 2.5 Pro (vision analysis, multimodal)
- **Secondary Model:** OpenAI GPT-5 (meal plans, complex reasoning)
- **Fallback Model:** Gemini 2.5 Flash (fast responses, cost-effective)

### Frontend Stack (MINIMAL)
- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS only (no UI libraries initially)
- **Icons:** lucide-react (lightweight)
- **Forms:** Native HTML5 validation (no libraries initially)
- **Components:** Custom-built, minimal dependencies

### Infrastructure
- **Hosting:** Vercel Edge Functions
- **Database:** NONE (stateless for LGPD compliance)
- **File Storage:** Memory-only during session
- **Analytics:** None (privacy-first)

## Development Philosophy

### Start Simple, Iterate Fast
1. **MVP First:** Basic chat interface with AI integration
2. **Core Features Only:** Chat, analysis, meal plan
3. **No Premature Optimization:** Add complexity only when needed
4. **Manual Testing First:** No test framework initially

### Progressive Enhancement
```
Phase 1: Text chat with AI (Week 1)
Phase 2: Image upload/analysis (Week 2)
Phase 3: Meal plans & calculations (Week 3)
Phase 4: Polish & CTAs (Week 4)
```

## Ground-Up Implementation Plan

### Step 1: Basic Next.js Setup
```bash
# Create from scratch (no template)
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

# Essential packages only
npm install ai@latest @ai-sdk/ai-gateway @ai-sdk/google @ai-sdk/openai lucide-react
```

### Step 2: Environment Configuration
```env
# .env.local
# AI Gateway (unified access, no individual keys needed in production)
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key_here

# Direct provider keys (for development/fallback)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
OPENAI_API_KEY=your_openai_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME="Analisador Corporal IA"
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/dr-leitner
NEXT_PUBLIC_USE_GATEWAY=true
```

### Step 3: Core File Structure
```
agendador/
├── app/
│   ├── layout.tsx          # Root layout with minimal setup
│   ├── page.tsx            # Landing/chat interface
│   ├── globals.css         # Tailwind base styles
│   └── api/
│       ├── chat/
│       │   └── route.ts    # Main chat endpoint
│       └── analyze/
│           └── route.ts    # Image analysis endpoint
├── components/
│   ├── chat.tsx           # Chat interface component
│   ├── message.tsx        # Message bubble component
│   └── upload.tsx         # Image upload component
├── lib/
│   ├── ai.ts             # AI configuration
│   └── utils.ts          # Helper functions
└── public/
    └── (assets)
```

## AI Integration with Gateway & SDK 5

### Unified AI Gateway Setup
```typescript
// lib/ai.ts
import { createAIGateway } from '@ai-sdk/ai-gateway';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

const useGateway = process.env.NEXT_PUBLIC_USE_GATEWAY === 'true';

// AI Gateway for production (unified access)
const gateway = useGateway ? createAIGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1'
}) : null;

// Model configurations
export const visionModel = useGateway
  ? gateway.model('google/gemini-2.5-pro')
  : google('gemini-2.5-pro', {
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
    });

export const chatModel = useGateway
  ? gateway.model('google/gemini-2.5-flash')
  : google('gemini-2.5-flash', {
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
    });

export const plannerModel = useGateway
  ? gateway.model('openai/gpt-5')
  : openai('gpt-5', {
      apiKey: process.env.OPENAI_API_KEY
    });

// System prompts for different contexts
export const systemPrompts = {
  chat: `
    Você é uma nutricionista especializada em análise corporal.
    Fale sempre em português brasileiro.
    Seja empática, profissional e motivadora.
    Sugira consulta com Dr. Guilherme Leitner quando apropriado.
  `,
  vision: `
    Analise a composição corporal nas imagens fornecidas.
    Identifique: postura, distribuição de gordura, massa muscular aparente.
    Seja respeitoso e profissional na análise.
    Forneça insights construtivos e motivadores.
  `,
  planner: `
    Crie planos alimentares detalhados e personalizados.
    Use alimentos brasileiros comuns.
    Calcule macros precisamente.
    Inclua horários e porções específicas.
    Considere praticidade e custo-benefício.
  `
};
```

### Enhanced Chat Implementation with AI SDK 5
```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { chatModel, systemPrompts } from '@/lib/ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // AI SDK 5 features: type-safe streaming with data parts
  const result = await streamText({
    model: chatModel,
    system: systemPrompts.chat,
    messages,
    // AI SDK 5: Enhanced tool calling
    tools: {
      calculateBMR: {
        description: 'Calculate Basal Metabolic Rate',
        parameters: z.object({
          weight: z.number(),
          height: z.number(),
          age: z.number(),
          gender: z.enum(['male', 'female'])
        }),
        execute: async (params) => calculateBMR(params)
      }
    },
    // AI SDK 5: Lifecycle hooks
    onStart: () => console.log('Chat started'),
    onComplete: (result) => console.log('Tokens:', result.usage)
  });

  // AI SDK 5: Enhanced data streaming
  return result.toDataStreamResponse();
}
```

## UI Components (Custom, No Libraries)

### Simple Chat Component
```tsx
// components/chat.tsx
'use client';

import { useChat } from 'ai/react';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={`mb-4 ${
            m.role === 'user' ? 'text-right' : 'text-left'
          }`}>
            <span className={`inline-block p-3 rounded-lg ${
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
        <input
          value={input}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Digite sua mensagem..."
        />
      </form>
    </div>
  );
}
```

## Image Analysis (Progressive Enhancement)

### Simple Upload Component
```tsx
// components/upload.tsx
export function Upload({ onUpload }: { onUpload: (files: File[]) => void }) {
  return (
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => onUpload(Array.from(e.target.files || []))}
      className="block w-full text-sm"
    />
  );
}
```

### Gemini 2.5 Pro Vision Analysis
```typescript
// app/api/analyze/route.ts
import { generateText } from 'ai';
import { visionModel, systemPrompts } from '@/lib/ai';

export async function POST(req: Request) {
  const formData = await req.formData();
  const images = formData.getAll('images') as File[];

  // Convert images for Gemini 2.5 Pro vision
  const imageData = await Promise.all(
    images.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      return {
        type: 'image' as const,
        image: buffer.toString('base64'),
        mimeType: file.type
      };
    })
  );

  // Gemini 2.5 Pro multimodal analysis
  const result = await generateText({
    model: visionModel,
    system: systemPrompts.vision,
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Analise detalhadamente estas imagens corporais' },
        ...imageData
      ]
    }],
    // Gemini 2.5 Pro supports up to 3,600 images
    maxTokens: 2000
  });

  return Response.json({
    analysis: result.text,
    usage: result.usage // Token tracking
  });
}
```

## BMR/TDEE Calculations (Pure Functions)

```typescript
// lib/calculations.ts
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'female') {
    return 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
  }
  return 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
}

export function calculateTDEE(bmr: number, activityLevel: number): number {
  return bmr * activityLevel;
}

// Activity levels
export const ACTIVITY_LEVELS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9
};
```

## GPT-5 Meal Plan Generation (Structured Output)

```typescript
// lib/meal-plan.ts
import { generateObject } from 'ai';
import { plannerModel, systemPrompts } from '@/lib/ai';
import { z } from 'zod';

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
});

export async function generateMealPlan(
  userData: UserData,
  tdee: number,
  preferences: string[]
) {
  // GPT-5 for complex reasoning and planning
  const result = await generateObject({
    model: plannerModel,
    system: systemPrompts.planner,
    prompt: `
      Crie um plano alimentar detalhado:
      - Calorias alvo: ${tdee} kcal
      - Objetivo: ${userData.goal}
      - Preferências: ${preferences.join(', ')}
      - Restrições: ${userData.restrictions || 'Nenhuma'}

      Use alimentos brasileiros típicos.
      Distribua as refeições ao longo do dia.
      Inclua opções práticas e acessíveis.
    `,
    schema: mealPlanSchema,
    // GPT-5 thinking mode for better planning
    mode: 'thinking'
  });

  return result.object;
}
```

## Conversion Strategy (Built-In)

### Strategic CTA Points
```typescript
// lib/cta.ts
export const ctaMessages = {
  afterAnalysis: "Quer resultados mais rápidos? Agende uma consulta com Dr. Leitner",
  complexQuestion: "Esta questão merece atenção personalizada. Que tal uma consulta?",
  timeSpent: "Você está investindo tempo na sua saúde! Vamos acelerar seus resultados?",
  uncertainty: "Para uma análise precisa, recomendo consulta profissional"
};

export function shouldShowCTA(context: {
  messageCount: number;
  timeSpent: number;
  lastCTA: Date | null;
}): boolean {
  // Show CTA after 5 messages, 3 minutes, or 5 minutes since last
  return (
    context.messageCount > 5 ||
    context.timeSpent > 180000 ||
    (context.lastCTA && Date.now() - context.lastCTA.getTime() > 300000)
  );
}
```

## Development Workflow

### Day 1-2: Foundation
```bash
# 1. Create Next.js app
# 2. Set up environment variables
# 3. Create basic layout and homepage
# 4. Implement simple chat interface
```

### Day 3-4: AI Integration
```bash
# 1. Configure Google AI SDK
# 2. Create chat API endpoint
# 3. Add streaming responses
# 4. Test with Portuguese prompts
```

### Day 5-6: Features
```bash
# 1. Add image upload
# 2. Implement BMR/TDEE calculations
# 3. Create meal plan generation
# 4. Add strategic CTAs
```

### Day 7: Polish & Deploy
```bash
# 1. Mobile responsive design
# 2. Loading states
# 3. Error handling
# 4. Deploy to Vercel
```

## Testing Checklist (Manual)

### Core Functionality
- [ ] Chat responds in Portuguese
- [ ] Streaming works smoothly
- [ ] Images upload successfully
- [ ] Calculations are accurate
- [ ] CTAs appear at right moments

### User Experience
- [ ] Mobile responsive
- [ ] Fast response times (< 2s)
- [ ] Clear error messages
- [ ] Smooth animations
- [ ] Privacy notice visible

## Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables are set in Vercel dashboard
```

### Production Checklist
- [ ] Environment variables configured
- [ ] HTTPS enforced
- [ ] Error tracking disabled (privacy)
- [ ] No console.logs in production
- [ ] LGPD compliance verified

## Common Issues & Quick Fixes

### Issue: API Rate Limiting
```typescript
// Add exponential backoff
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
let retries = 0;
while (retries < 3) {
  try {
    return await callAPI();
  } catch (e) {
    await delay(Math.pow(2, retries) * 1000);
    retries++;
  }
}
```

### Issue: Large Image Files
```typescript
// Compress before upload
const MAX_SIZE = 1024 * 1024; // 1MB
if (file.size > MAX_SIZE) {
  // Resize using canvas
}
```

### Issue: Slow Streaming
```typescript
// Use Gemini Flash instead of Pro
model = google('gemini-2.0-flash-exp');
```

## Next Steps After MVP

### Priority 1: Analytics (Anonymous)
- Session duration tracking
- Conversion funnel analysis
- Popular questions identification

### Priority 2: Enhanced UX
- Typing indicators
- Message reactions
- Progress bars for analysis

### Priority 3: Advanced Features
- Voice input
- WhatsApp integration
- PDF report generation

## Key Principles

1. **Start simple** - No over-engineering
2. **User-first** - Every feature drives conversion
3. **Privacy-first** - No tracking, no cookies
4. **Mobile-first** - Primary platform
5. **Portuguese-only** - Target market focus
6. **Fast iteration** - Ship daily
7. **Manual testing** - No test complexity initially
8. **Direct feedback** - User testing over assumptions

## Session Notes

This is a **ground-up implementation** focusing on:
- Minimal dependencies
- Fast development
- Clear code structure
- Direct AI integration
- Progressive enhancement
- Conversion optimization

Skip the template complexity. Build what matters.

---

**Last Updated:** September 26, 2025
**Approach:** Ground-up development
**Timeline:** 1 week to MVP
**Priority:** Working product over perfect code