// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) throw new Error('No prompt provided');

    // 1. Setup Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 2. Fetch System Prompt from DB
    const { data: setting, error: dbError } = await supabaseClient
      .from('admin_settings')
      .select('value')
      .eq('key', 'ai_system_prompt')
      .single();

    // Fallback prompt if DB fails
    let systemPrompt = setting?.value;
    
    if (!systemPrompt || dbError) {
      console.warn("Could not fetch system prompt from DB, using fallback.");
      systemPrompt = `You are a persuasive copywriter. Output JSON only.`; 
    }

    // 3. Call OpenAI
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) throw new Error('OpenAI API Key not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the raw idea: ${prompt}` }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!data.choices) throw new Error(JSON.stringify(data));
    
    const aiContent = data.choices[0].message.content;
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