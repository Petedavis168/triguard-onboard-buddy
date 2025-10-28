import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  event_type: string;
  data: any;
}

const sendSmtpEmail = async (to: string | string[], subject: string, html: string) => {
  const client = new SmtpClient();
  
  try {
    await client.connectTLS({
      hostname: "smtp.mailgun.org",
      port: 587,
      username: Deno.env.get("MAILGUN_SMTP_USER") || "",
      password: Deno.env.get("MAILGUN_SMTP_PASSWORD") || "",
    });

    await client.send({
      from: "TriGuard Notifications <notifications@triguardroofing.com>",
      to: typeof to === 'string' ? to : to.join(', '),
      subject,
      content: html,
      html,
    });

    await client.close();
    return { success: true };
  } catch (error) {
    console.error("SMTP Error:", error);
    await client.close();
    throw error;
  }
};

const processTemplate = (template: string, data: any): string => {
  let processed = template;
  
  // Replace {event_type}
  processed = processed.replace(/{event_type}/g, data.event_type || '');
  
  // Replace {data} with JSON stringified data
  processed = processed.replace(/{data}/g, JSON.stringify(data.data || {}, null, 2));
  
  // Replace any specific data fields like {data.name}
  const dataMatches = processed.match(/{data\.([^}]+)}/g);
  if (dataMatches) {
    dataMatches.forEach(match => {
      const key = match.replace('{data.', '').replace('}', '');
      const value = data.data?.[key] || '';
      processed = processed.replace(new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });
  }
  
  return processed;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    
    console.log('Processing webhook event:', payload.event_type);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active webhooks for this event type
    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('event_type', payload.event_type)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching webhooks:', error);
      throw error;
    }

    const results = [];

    for (const webhook of webhooks || []) {
      console.log(`Processing webhook: ${webhook.name}`);

      // Send email if configured
      if (webhook.send_email && webhook.email_recipients?.length > 0) {
        try {
          const subject = processTemplate(webhook.email_subject || 'Webhook Event', {
            event_type: payload.event_type,
            data: payload.data
          });
          
          const html = processTemplate(webhook.email_template || '<p>Event received: {event_type}</p>', {
            event_type: payload.event_type,
            data: payload.data
          });

          await sendSmtpEmail(webhook.email_recipients, subject, html);
          results.push({ webhook: webhook.name, email: 'sent' });
          console.log(`Email sent for webhook: ${webhook.name}`);
        } catch (emailError: any) {
          console.error(`Email error for ${webhook.name}:`, emailError);
          results.push({ webhook: webhook.name, email: 'failed', error: emailError.message });
        }
      }

      // Call external endpoint if configured
      if (webhook.endpoint_url) {
        try {
          const response = await fetch(webhook.endpoint_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'TriGuard-Webhook/1.0',
              ...(webhook.headers || {})
            },
            body: JSON.stringify({
              event: payload.event_type,
              timestamp: new Date().toISOString(),
              data: payload.data
            })
          });

          results.push({ 
            webhook: webhook.name, 
            endpoint: 'called', 
            status: response.status 
          });
          console.log(`Endpoint called for webhook: ${webhook.name}, status: ${response.status}`);
        } catch (endpointError: any) {
          console.error(`Endpoint error for ${webhook.name}:`, endpointError);
          results.push({ webhook: webhook.name, endpoint: 'failed', error: endpointError.message });
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Processed ${results.length} webhook actions`,
      results
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in process-webhook:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
