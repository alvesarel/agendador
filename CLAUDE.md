# CLAUDE.md - Project Context & Instructions (Ground-Up Approach)

## Project Overview
**Name:** AI Body Composition Analyzer (Analisador Corporal IA)
**Purpose:** Lead generation tool for Dr. Guilherme Leitner's consultation services
**Target Audience:** Brazilian women, 35-55 years old, upper-class, seeking body transformation
**Language:** Brazilian Portuguese (all UI/UX)
**Development Approach:** Ground-up implementation with minimal dependencies
**Status:** Starting fresh implementation

## Core Technology Stack (SIMPLIFIED)

### AI/ML Stack
- **AI SDK:** Vercel AI SDK 5 (latest stable)
- **Provider:** @ai-sdk/google for Gemini integration
- **Model:** Google Gemini 2.0 Flash (fast, cost-effective)
- **API Key:** Direct Google AI Studio key (already configured)

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
npx create-next-app@latest agendador \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd agendador

# Essential packages only
npm install ai @ai-sdk/google lucide-react
```

### Step 2: Environment Configuration
```env
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
NEXT_PUBLIC_APP_NAME="Analisador Corporal IA"
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/dr-leitner
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

## Simplified AI Integration

### Direct Gemini Setup (No Gateway)
```typescript
// lib/ai.ts
import { google } from '@ai-sdk/google';

// Use Gemini Flash for speed and cost
export const model = google('gemini-2.0-flash-exp', {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

// System prompt for Brazilian context
export const systemPrompt = `
Você é um especialista em análise corporal e nutrição.
Fale sempre em português brasileiro.
Seja profissional mas acessível.
Sempre sugira consulta com Dr. Guilherme Leitner quando apropriado.
`;
```

### Minimal Chat Implementation
```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { model, systemPrompt } from '@/lib/ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model,
    system: systemPrompt,
    messages,
  });

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

### Direct Gemini Vision
```typescript
// app/api/analyze/route.ts
export async function POST(req: Request) {
  const formData = await req.formData();
  const images = formData.getAll('images') as File[];

  // Convert to base64
  const imageData = await Promise.all(
    images.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      return {
        mimeType: file.type,
        data: buffer.toString('base64')
      };
    })
  );

  const result = await generateText({
    model,
    prompt: 'Analyze these body composition images',
    images: imageData
  });

  return Response.json({ analysis: result.text });
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

## Meal Plan Generation (Structured Output)

```typescript
// lib/meal-plan.ts
const brazilianFoods = {
  proteins: ['frango grelhado', 'peixe assado', 'ovos cozidos'],
  carbs: ['arroz integral', 'batata doce', 'aipim'],
  vegetables: ['brócolis', 'espinafre', 'tomate'],
  fruits: ['banana', 'maçã', 'laranja']
};

export async function generateMealPlan(
  calories: number,
  preferences: string[]
) {
  const prompt = `
    Crie um plano alimentar brasileiro com ${calories} calorias.
    Preferências: ${preferences.join(', ')}
    Use alimentos comuns no Brasil.
    Formato: JSON com café, almoço, jantar e lanches.
  `;

  const result = await generateObject({
    model,
    prompt,
    schema: mealPlanSchema
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