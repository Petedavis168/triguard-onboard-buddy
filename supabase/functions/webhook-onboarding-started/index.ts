import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OnboardingStartedPayload {
  form_id: string;
  employee_data: {
    name: string;
    email: string;
    personal_email: string;
    cell_phone: string;
    started_at: string;
  };
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
      from: "TriGuard Onboarding <onboarding@triguardroofing.com>",
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

const sendAdminNotification = async (payload: OnboardingStartedPayload) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; border-radius: 5px; }
          .label { font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Onboarding Started</h1>
            <p>A new employee has begun the onboarding process</p>
          </div>
          <div class="content">
            <h2>Employee Details</h2>
            
            <div class="info-box">
              <p><span class="label">Name:</span> ${payload.employee_data.name}</p>
              <p><span class="label">Email:</span> ${payload.employee_data.email}</p>
              <p><span class="label">Personal Email:</span> ${payload.employee_data.personal_email}</p>
              <p><span class="label">Phone:</span> ${payload.employee_data.cell_phone}</p>
            </div>
            
            <div class="info-box">
              <p><span class="label">Form ID:</span> ${payload.form_id}</p>
              <p><span class="label">Started At:</span> ${new Date(payload.employee_data.started_at).toLocaleString()}</p>
            </div>
            
            <p style="margin-top: 20px;">
              <a href="https://wowtanjkkwjahwmwromy.supabase.co" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View in Admin Dashboard
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 TriGuard Roofing - Onboarding System</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendSmtpEmail(
    ["admin@triguardroofing.com"],
    `Onboarding Started: ${payload.employee_data.name}`,
    emailHtml
  );
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: OnboardingStartedPayload = await req.json();

    console.log('Processing onboarding started webhook:', payload);

    // Send admin notification
    const emailResult = await sendAdminNotification(payload);

    // Also send webhook to external system if configured
    const externalWebhookUrl = Deno.env.get("ONBOARDING_STARTED_WEBHOOK_URL");
    if (externalWebhookUrl) {
      try {
        await fetch(externalWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'TriGuard-Webhook/1.0',
          },
          body: JSON.stringify({
            event: 'onboarding.started',
            timestamp: new Date().toISOString(),
            data: payload,
          })
        });
        console.log('External webhook sent successfully');
      } catch (webhookError) {
        console.error('External webhook failed:', webhookError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Onboarding started notifications sent',
      email_sent: emailResult 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in webhook-onboarding-started:", error);
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
