import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
};

const validateApiKey = (req: Request): boolean => {
  const apiKey = req.headers.get('x-api-key');
  const validApiKey = Deno.env.get('TRIGUARD_API_KEY');
  
  if (!validApiKey) {
    console.warn('TRIGUARD_API_KEY not set - API endpoints are unprotected!');
    return true; // Allow access if no API key is configured
  }
  
  return apiKey === validApiKey;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate API key for protected endpoints
  if (!validateApiKey(req)) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing API key" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  
  // Remove 'functions/v1/api-endpoints' from path
  const apiPath = pathSegments.slice(3).join('/');

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetRequest(supabase, apiPath, url.searchParams);
      case 'POST':
        return await handlePostRequest(supabase, apiPath, req);
      case 'PUT':
        return await handlePutRequest(supabase, apiPath, req);
      case 'DELETE':
        return await handleDeleteRequest(supabase, apiPath);
      default:
        return new Response(
          JSON.stringify({ error: "Method not allowed" }),
          {
            status: 405,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
    }
  } catch (error: any) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

const handleGetRequest = async (supabase: any, path: string, searchParams: URLSearchParams) => {
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  const status = searchParams.get('status');

  switch (path) {
    case 'onboarding/forms':
      let query = supabase
        .from('onboarding_forms')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: forms, error: formsError } = await query;
      
      if (formsError) throw formsError;
      
      return new Response(JSON.stringify({
        data: forms,
        pagination: {
          limit,
          offset,
          count: forms.length
        }
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    case 'onboarding/stats':
      const { data: stats, error: statsError } = await supabase
        .rpc('get_onboarding_stats');
      
      if (statsError) throw statsError;
      
      return new Response(JSON.stringify({ data: stats }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    case 'teams':
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (teamsError) throw teamsError;
      
      return new Response(JSON.stringify({ data: teams }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    case 'managers':
      const { data: managers, error: managersError } = await supabase
        .from('managers')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (managersError) throw managersError;
      
      return new Response(JSON.stringify({ data: managers }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    default:
      // Handle single resource requests like onboarding/forms/{id}
      const segments = path.split('/');
      if (segments.length === 2 && segments[0] === 'onboarding' && segments[1] !== 'forms') {
        const formId = segments[1];
        const { data: form, error: formError } = await supabase
          .from('onboarding_forms')
          .select('*')
          .eq('id', formId)
          .maybeSingle();
        
        if (formError) throw formError;
        
        if (!form) {
          return new Response(
            JSON.stringify({ error: "Form not found" }),
            {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
        
        return new Response(JSON.stringify({ data: form }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(
        JSON.stringify({ error: "Endpoint not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
  }
};

const handlePostRequest = async (supabase: any, path: string, req: Request) => {
  const body = await req.json();

  switch (path) {
    case 'webhooks/test':
      // Test webhook endpoint
      return new Response(JSON.stringify({
        success: true,
        message: "Webhook received successfully",
        data: body,
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    case 'onboarding/export':
      // Export onboarding data
      const { format = 'json', filters = {} } = body;
      
      let query = supabase.from('onboarding_forms').select('*');
      
      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.team_id) query = query.eq('team_id', filters.team_id);
      if (filters.date_from) query = query.gte('created_at', filters.date_from);
      if (filters.date_to) query = query.lte('created_at', filters.date_to);
      
      const { data: exportData, error: exportError } = await query;
      
      if (exportError) throw exportError;
      
      return new Response(JSON.stringify({
        data: exportData,
        format,
        exported_at: new Date().toISOString(),
        count: exportData.length
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    default:
      return new Response(
        JSON.stringify({ error: "Endpoint not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
  }
};

const handlePutRequest = async (supabase: any, path: string, req: Request) => {
  const body = await req.json();
  
  // Handle updates - implement as needed
  return new Response(
    JSON.stringify({ error: "PUT method not implemented for this endpoint" }),
    {
      status: 501,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
};

const handleDeleteRequest = async (supabase: any, path: string) => {
  // Handle deletions - implement as needed
  return new Response(
    JSON.stringify({ error: "DELETE method not implemented for this endpoint" }),
    {
      status: 501,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
};

serve(handler);