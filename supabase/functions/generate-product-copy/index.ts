// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API Key not configured');
    }

    const systemPrompt = `
    You are JORDI-GPT, an elite direct-response copywriter and aggressive sales expert. 
    Your goal is to take a raw, unstructured product idea and transform it into a high-converting, persuasive product listing.
    
    Tone: Professional, high-energy, authoritative, slightly aggressive (like the "Wolf of Wall Street" meets a Tech Visionary).
    
    You MUST output valid JSON only. No markdown formatting, no backticks.
    
    The JSON structure must match this interface exactly:
    {
      "title": "A punchy, short, catchy title (max 5 words)",
      "short_description": "A hook. 1-2 sentences that grab attention immediately.",
      "full_description": "A persuasive sales letter. Use AIDA (Attention, Interest, Desire, Action). Focus on benefits, not features. Address pain points.",
      "price": number (suggest a psychological price ending in .99 or .00 based on value),
      "price_display": "string (e.g. 'US$ 29.99')",
      "features": ["Feature 1 (benefit oriented)", "Feature 2", "Feature 3", "Feature 4"],
      "cta_text": "Action verb (e.g. 'UNLOCK NOW', 'START PROFITING')",
      "badge": "Short 2-word badge (e.g. 'BEST SELLER', 'NEW METHOD')",
      "price_microcopy": "Reassurance text (e.g. 'Lifetime access · Instant delivery')",
      "image_type": "Select strictly one of these values: 'chart-line-up', 'infinity', 'unlock'"
    }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // or gpt-3.5-turbo if prefer lower cost
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the raw idea: ${prompt}` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const aiContent = data.choices[0].message.content;

    // Clean up potential formatting issues if AI adds markdown
    const jsonStr = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonStr);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});