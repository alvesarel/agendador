# Product Requirements Document (PRD) - Simplified Version

## Executive Summary

**Product:** AI Body Composition Analyzer
**Goal:** Generate qualified leads for Dr. Guilherme Leitner's consultation services
**Approach:** Free AI-powered body analysis tool with strategic conversion points
**Timeline:** 1 week to MVP, 2 weeks to production

## Problem Statement

Brazilian women (35-55) seeking body transformation need:
- Quick, accessible health assessment
- Personalized nutrition guidance
- Professional validation
- Clear action plans

Current solutions are either too generic (apps) or too expensive (consultations) for initial evaluation.

## Solution

A conversational AI tool that:
1. Provides immediate value (free analysis)
2. Builds trust through accurate insights
3. Creates desire for deeper guidance
4. Converts to paid consultations

## Core User Journey

```
1. Landing (0-10s)
   → Clear value proposition
   → Privacy assurance (LGPD)
   → Start button

2. Data Collection (10-60s)
   → Age, height, weight
   → Activity level
   → Goals

3. Photo Upload (60-90s) [Optional]
   → Front, side, back views
   → Instant processing
   → Privacy reminder

4. AI Analysis (90-120s)
   → Real-time streaming
   → Body composition estimate
   → BMR/TDEE calculation

5. Meal Plan (120-180s)
   → Brazilian foods
   → Personalized macros
   → Practical tips

6. CTA (180s+)
   → "Want faster results?"
   → Calendly integration
   → Urgency/scarcity
```

## Features (MVP)

### Must Have (Week 1)
- [x] Chat interface
- [x] Portuguese AI responses
- [x] BMR/TDEE calculator
- [x] Basic meal suggestions
- [x] Calendly link integration

### Should Have (Week 2)
- [ ] Image upload/analysis
- [ ] Structured meal plans
- [ ] Progress indicators
- [ ] Mobile optimization
- [ ] Strategic CTA timing

### Nice to Have (Post-MVP)
- [ ] WhatsApp integration
- [ ] PDF reports
- [ ] Email capture
- [ ] Testimonials
- [ ] Social sharing

## Success Metrics

### Primary KPIs
- **Conversion Rate:** > 10% (chat → booking)
- **Session Duration:** > 5 minutes
- **Complete Analysis:** > 70% of users

### Secondary KPIs
- Time to first response: < 2s
- Image analysis time: < 5s
- Mobile usage: > 60%
- Return visits: > 20%

## Technical Requirements

### Performance
- TTFB < 200ms
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### Compatibility
- Chrome 90+
- Safari 14+
- Mobile Safari
- Samsung Internet

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Font scaling

## Content Strategy

### Tone of Voice
- Professional yet friendly
- Empathetic and supportive
- Action-oriented
- Subtly urgent

### Key Messages
1. "Transforme seu corpo com ciência"
2. "Análise profissional gratuita"
3. "Resultados em minutos"
4. "Plano personalizado para você"

### CTA Triggers
- After showing results
- When asking complex questions
- After 5 minutes engagement
- On revisit

## Legal & Compliance

### LGPD Requirements
- No data storage
- Clear consent flow
- Session-only processing
- No cookies/tracking

### Medical Disclaimer
- "For educational purposes"
- "Not medical advice"
- "Consult professional"
- Clear disclaimers

## Competitive Advantage

### Why This Works
1. **Free Value:** Immediate useful results
2. **Authority:** Dr. Leitner's credentials
3. **Personalization:** AI-powered insights
4. **Convenience:** No app download
5. **Trust:** Privacy-first approach

### Differentiation
- Brazilian food focus
- Portuguese native language
- Medical professional backing
- No registration required
- Instant results

## Risk Mitigation

### Technical Risks
- API rate limits → Implement caching
- Slow responses → Use Gemini Flash
- Image size → Client-side compression

### Business Risks
- Low conversion → A/B test CTAs
- High costs → Monitor API usage
- Competition → Fast iteration

## Launch Strategy

### Week 1: Soft Launch
- Friends & family testing
- Collect feedback
- Fix critical bugs
- Refine CTAs

### Week 2: Beta Launch
- Limited audience (100 users)
- Track conversions
- Optimize flow
- Prepare scale

### Week 3: Public Launch
- Social media announcement
- WhatsApp groups
- Email campaign
- PR outreach

## Future Roadmap

### Month 2
- WhatsApp Business API
- Automated follow-ups
- A/B testing framework

### Month 3
- Multi-language support
- Video consultations
- Payment integration

### Month 6
- Mobile app
- Wearable integration
- Community features

---

**Version:** 3.0 (Simplified)
**Date:** September 26, 2025
**Status:** Ready for Development