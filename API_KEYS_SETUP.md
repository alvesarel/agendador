# API Keys Setup Instructions

## Problem
The application was failing with "Falha na análise visual" because the AI provider API keys were not configured.

## Solution
You need to add API keys to Vercel environment variables for the application to work in production.

## Required Environment Variables

### 1. GEMINI_API_KEY (Required - Primary Model)
- Get your API key from: https://makersuite.google.com/app/apikey
- **Alternative name**: You can also use `GOOGLE_GENERATIVE_AI_API_KEY`
- This is used for:
  - Vision analysis (comparing current vs goal photos)
  - Chat conversations

### 2. OPENAI_API_KEY (Required - Meal Plans)
- Get your API key from: https://platform.openai.com/api-keys
- This is used for:
  - Generating detailed meal plans with GPT-4

## How to Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/contentgen/analisador-corporal
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add each variable:
   - **Variable Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key
   - **Environments**: Production, Preview, Development (check all)
   - Click "Save"

5. Repeat for `OPENAI_API_KEY`

6. Redeploy the application:
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Click "Redeploy"

## Verification

After adding the keys and redeploying:
1. Upload photos on the intake form
2. Submit the analysis
3. You should see the AI analysis appear in the chat
4. Check browser console (F12) for detailed logs

## Local Development

If you want to test locally:
1. Copy `.env.local` file
2. Add your API keys:
   ```
   GEMINI_API_KEY=your_gemini_key_here
   OPENAI_API_KEY=your_openai_key_here
   ```
3. Run `npm run dev`

## Current Model Configuration

- **Vision Analysis**: `gemini-2.5-pro` (Google Gemini 2.5 Pro)
- **Chat**: `gemini-2.5-flash` (Google Gemini 2.5 Flash)
- **Meal Plans**: `gpt-5` (OpenAI GPT-5)

These models were chosen for:
- Superior multimodal capabilities (vision + text) - Gemini 2.5
- Latest Gemini 2.5 generation with improved reasoning
- GPT-5 for advanced meal planning with best reasoning capabilities
- Cost-effectiveness and reliability