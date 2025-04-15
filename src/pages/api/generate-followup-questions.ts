
import { supabase } from '@/integrations/supabase/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { data, error } = await supabase.functions.invoke('generate-followup-questions', {
      body: body
    });

    if (error) {
      console.error('Error invoking Edge Function:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API route error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
