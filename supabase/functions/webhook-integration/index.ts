import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  event_type: string;
  data: any;
  webhook_url: string;
  headers?: Record<string, string>;
}

const sendWebhook = async (webhookUrl: string, payload: any, headers: Record<string, string> = {}) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TriGuard-Webhook/1.0',
        ...headers
      },
      body: JSON.stringify(payload)
    });

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Webhook delivery failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { event_type, data, webhook_url, headers: customHeaders }: WebhookPayload = await req.json();

    if (!webhook_url || !event_type || !data) {
      return new Response(
        JSON.stringify({ error: "webhook_url, event_type, and data are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending webhook for event: ${event_type} to ${webhook_url}`);

    // Prepare webhook payload with metadata
    const webhookPayload = {
      event: event_type,
      timestamp: new Date().toISOString(),
      data: data,
      source: 'triguard-onboarding'
    };

    // Send the webhook
    const result = await sendWebhook(webhook_url, webhookPayload, customHeaders || {});

    // Log webhook attempt (you could store this in a webhooks_log table)
    console.log('Webhook delivery result:', result);

    return new Response(JSON.stringify({
      success: true,
      delivery_result: result,
      payload: webhookPayload
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in webhook-integration function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);