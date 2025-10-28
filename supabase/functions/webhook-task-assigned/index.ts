import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TaskAssignedPayload {
  employee_data: {
    first_name: string;
    last_name: string;
    email: string;
    personal_email?: string;
  };
  task_data: {
    task_title: string;
    task_description?: string;
    assigned_by: string;
  };
}

const sendSmtpEmail = async (to: string, subject: string, html: string) => {
  const client = new SmtpClient();
  
  try {
    await client.connectTLS({
      hostname: "smtp.mailgun.org",
      port: 587,
      username: Deno.env.get("MAILGUN_SMTP_USER") || "",
      password: Deno.env.get("MAILGUN_SMTP_PASSWORD") || "",
    });

    await client.send({
      from: "TriGuard Tasks <tasks@triguardroofing.com>",
      to,
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

const sendTaskNotificationEmail = async (payload: TaskAssignedPayload) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
          .task-title { color: #667eea; margin-top: 0; font-size: 24px; }
          .button { background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .assigned-by { background: #e7f3ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Task Assigned</h1>
            <p>You have a new task to complete</p>
          </div>
          <div class="content">
            <p>Hi ${payload.employee_data.first_name},</p>
            <p>A new task has been assigned to you.</p>
            
            <div class="task-box">
              <h2 class="task-title">${payload.task_data.task_title}</h2>
              
              ${payload.task_data.task_description ? `
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                  <p style="margin: 0;"><strong>Description:</strong></p>
                  <p style="margin: 10px 0 0 0;">${payload.task_data.task_description}</p>
                </div>
              ` : ''}
              
              <div class="assigned-by">
                <strong>Assigned by:</strong> ${payload.task_data.assigned_by}
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Please acknowledge this task in your onboarding portal as soon as possible.
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="https://your-portal-url.com" class="button">
                View Task in Portal
              </a>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 30px; border-radius: 5px;">
              <p style="margin: 0; color: #856404;">
                <strong>⏰ Action Required:</strong> Please complete this task during your onboarding process.
              </p>
            </div>

            <p style="margin-top: 30px; color: #666;">
              If you have any questions about this task, please contact your manager or the HR team at 
              <a href="mailto:onboarding@triguardroofing.com">onboarding@triguardroofing.com</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 TriGuard Roofing - Task Management System</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const recipientEmail = payload.employee_data.personal_email || payload.employee_data.email;
  
  return await sendSmtpEmail(
    recipientEmail,
    `New Task Assigned: ${payload.task_data.task_title}`,
    emailHtml
  );
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: TaskAssignedPayload = await req.json();

    console.log('Processing task assigned webhook:', payload);

    // Send task notification email
    const emailResult = await sendTaskNotificationEmail(payload);

    // Also send webhook to external system if configured
    const externalWebhookUrl = Deno.env.get("TASK_ASSIGNED_WEBHOOK_URL");
    if (externalWebhookUrl) {
      try {
        await fetch(externalWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'TriGuard-Webhook/1.0',
          },
          body: JSON.stringify({
            event: 'task.assigned',
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
      message: 'Task assignment notification sent',
      email_sent: emailResult 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in webhook-task-assigned:", error);
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
