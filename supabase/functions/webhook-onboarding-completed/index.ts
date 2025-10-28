import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OnboardingCompletedPayload {
  form_id: string;
  employee_data: {
    name: string;
    email: string;
    personal_email: string;
    cell_phone: string;
    username?: string;
    user_password?: string;
    employee_role?: string;
    team_id?: string;
    manager_id?: string;
    address?: any;
    gear_sizes?: any;
    completed_at: string;
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

const sendAdminCompletionEmail = async (payload: OnboardingCompletedPayload) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #28a745; border-radius: 5px; }
          .label { font-weight: bold; color: #28a745; }
          .credentials { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Onboarding Completed!</h1>
            <p>Employee has completed the onboarding process</p>
          </div>
          <div class="content">
            <h2>Employee Information</h2>
            
            <div class="info-box">
              <p><span class="label">Name:</span> ${payload.employee_data.name}</p>
              <p><span class="label">Email:</span> ${payload.employee_data.email}</p>
              <p><span class="label">Personal Email:</span> ${payload.employee_data.personal_email}</p>
              <p><span class="label">Phone:</span> ${payload.employee_data.cell_phone}</p>
              <p><span class="label">Role:</span> ${payload.employee_data.employee_role || 'Not specified'}</p>
            </div>

            ${payload.employee_data.username ? `
            <div class="credentials">
              <h3 style="margin-top: 0; color: #856404;">Login Credentials</h3>
              <p><span class="label">Username:</span> ${payload.employee_data.username}</p>
              <p><span class="label">Password:</span> ${payload.employee_data.user_password}</p>
            </div>
            ` : ''}

            ${payload.employee_data.address ? `
            <div class="info-box">
              <p><span class="label">Address:</span> ${payload.employee_data.address.street}, ${payload.employee_data.address.city}, ${payload.employee_data.address.state} ${payload.employee_data.address.zip}</p>
            </div>
            ` : ''}
            
            <div class="info-box">
              <p><span class="label">Form ID:</span> ${payload.form_id}</p>
              <p><span class="label">Completed At:</span> ${new Date(payload.employee_data.completed_at).toLocaleString()}</p>
            </div>
            
            <p style="margin-top: 20px;">
              <a href="https://wowtanjkkwjahwmwromy.supabase.co" 
                 style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Full Details in Dashboard
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
    `Onboarding Completed: ${payload.employee_data.name}`,
    emailHtml
  );
};

const sendWelcomeEmail = async (payload: OnboardingCompletedPayload) => {
  const welcomeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials-box { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .credential-item { background: white; padding: 12px; margin: 8px 0; border-radius: 5px; font-family: monospace; font-size: 16px; }
          .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745; border-radius: 5px; }
          .button { background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to TriGuard Roofing!</h1>
            <p>We're excited to have you on the team!</p>
          </div>
          <div class="content">
            <p>Hi ${payload.employee_data.name.split(' ')[0]},</p>
            <p>Congratulations on completing your onboarding! You're now officially part of the TriGuard Roofing family.</p>
            
            ${payload.employee_data.username ? `
            <div class="credentials-box">
              <h3 style="margin-top: 0; color: #856404;">🔐 Your Login Credentials</h3>
              <div class="credential-item">
                <strong>Username:</strong> ${payload.employee_data.username}
              </div>
              <div class="credential-item">
                <strong>Password:</strong> ${payload.employee_data.user_password}
              </div>
              <p style="color: #856404; margin-top: 10px;">⚠️ Please change your password after first login.</p>
            </div>
            ` : ''}
            
            <div class="info-box">
              <h3>📧 Your Company Email</h3>
              <p><strong>${payload.employee_data.email}</strong></p>
            </div>
            
            <h3>What's Next:</h3>
            <ul style="line-height: 2;">
              <li>✅ Check your assigned tasks in the portal</li>
              <li>📚 Complete required training modules</li>
              <li>👥 Meet your team and manager</li>
              <li>🎯 Review company policies</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://your-portal-url.com" class="button">
                Access Your Dashboard
              </a>
            </div>

            <div class="info-box" style="margin-top: 30px;">
              <p><strong>Need Help?</strong></p>
              <p>Contact: <a href="mailto:onboarding@triguardroofing.com">onboarding@triguardroofing.com</a></p>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 TriGuard Roofing. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendSmtpEmail(
    payload.employee_data.personal_email,
    "Welcome to TriGuard Roofing - Your Account Information",
    welcomeHtml
  );
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: OnboardingCompletedPayload = await req.json();

    console.log('Processing onboarding completed webhook:', payload);

    // Send both admin and welcome emails
    const [adminResult, welcomeResult] = await Promise.all([
      sendAdminCompletionEmail(payload),
      sendWelcomeEmail(payload)
    ]);

    // Also send webhook to external system if configured
    const externalWebhookUrl = Deno.env.get("ONBOARDING_COMPLETED_WEBHOOK_URL");
    if (externalWebhookUrl) {
      try {
        await fetch(externalWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'TriGuard-Webhook/1.0',
          },
          body: JSON.stringify({
            event: 'onboarding.completed',
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
      message: 'Onboarding completion notifications sent',
      admin_email: adminResult,
      welcome_email: welcomeResult
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in webhook-onboarding-completed:", error);
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
