// Using SMTP directly instead of Resend
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'admin_notification' | 'welcome_email' | 'task_assignment';
  user_data?: {
    id: string;
    first_name: string;
    last_name: string;
    generated_email: string;
    username?: string;
    user_password?: string;
    employee_role?: string;
    position_id?: string;
    team_id?: string;
    manager_id?: string;
    cell_phone?: string;
    personal_email?: string;
  };
  task_data?: {
    task_title: string;
    task_description?: string;
    assigned_by: string;
  };
  admin_email?: string;
}

const sendAdminNotification = async (userData: any) => {
  const adminEmailHtml = `
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
            <h1>🎉 New Employee Created</h1>
            <p>A new employee has been added to the system</p>
          </div>
          <div class="content">
            <h2>Employee Information</h2>
            
            <div class="info-box">
              <p><span class="label">Name:</span> ${userData.first_name} ${userData.last_name}</p>
              <p><span class="label">Email:</span> ${userData.generated_email}</p>
              <p><span class="label">Personal Email:</span> ${userData.personal_email || 'N/A'}</p>
              <p><span class="label">Phone:</span> ${userData.cell_phone || 'N/A'}</p>
            </div>
            
            <div class="info-box">
              <p><span class="label">Role:</span> ${userData.employee_role || 'Not specified'}</p>
              <p><span class="label">Employee ID:</span> ${userData.id}</p>
            </div>

            ${userData.username ? `
            <div class="info-box">
              <p><span class="label">Username:</span> ${userData.username}</p>
              <p><span class="label">Temporary Password:</span> ${userData.user_password}</p>
            </div>
            ` : ''}
            
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
    ["admin@triguardroofing.com"], // Update with actual admin email
    `New Employee: ${userData.first_name} ${userData.last_name}`,
    adminEmailHtml
  );
};

const sendWelcomeEmail = async (userData: any) => {
  const welcomeEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials-box { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .credentials-box h3 { color: #856404; margin-top: 0; }
          .credential-item { background: white; padding: 12px; margin: 8px 0; border-radius: 5px; font-family: monospace; font-size: 16px; }
          .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745; border-radius: 5px; }
          .warning { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 15px 0; border-radius: 5px; color: #721c24; }
          .button { background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to TriGuard Roofing!</h1>
            <p>We're excited to have you on the team, ${userData.first_name}!</p>
          </div>
          <div class="content">
            <h2>Welcome Aboard! 🚀</h2>
            <p>Congratulations on joining TriGuard Roofing! We're thrilled to have you as part of our team. Below you'll find everything you need to get started.</p>
            
            ${userData.username && userData.user_password ? `
            <div class="credentials-box">
              <h3>🔐 Your Login Credentials</h3>
              <p>Please keep these credentials secure and change your password after first login.</p>
              
              <div class="credential-item">
                <strong>Username:</strong> ${userData.username}
              </div>
              <div class="credential-item">
                <strong>Password:</strong> ${userData.user_password}
              </div>
              
              <div class="warning">
                ⚠️ <strong>Important:</strong> You will be required to change your password on first login for security purposes.
              </div>
            </div>
            ` : ''}
            
            <div class="info-box">
              <h3>📧 Your Company Email</h3>
              <p><strong>${userData.generated_email}</strong></p>
              <p style="font-size: 14px; color: #666;">This will be your primary email for all company communications.</p>
            </div>
            
            <h3>What to Expect Next:</h3>
            <ul style="line-height: 2;">
              <li>✅ Complete your onboarding tasks in the portal</li>
              <li>📚 Review training materials and company policies</li>
              <li>👥 Meet your team and manager</li>
              <li>🎯 Start your initial training sessions</li>
              <li>📝 Complete all required documentation</li>
            </ul>
            
            <div class="info-box">
              <h3>📞 Need Help?</h3>
              <p>If you have any questions or need assistance, please don't hesitate to reach out:</p>
              <p>
                <strong>HR Team:</strong> <a href="mailto:onboarding@triguardroofing.com">onboarding@triguardroofing.com</a><br>
                <strong>Phone:</strong> (555) 123-4567
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="https://your-portal-url.com" class="button">
                Access Your Dashboard
              </a>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 TriGuard Roofing. All rights reserved.</p>
            <p>This email contains confidential information. Please do not share your credentials.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendSmtpEmail(
    userData.personal_email || userData.generated_email,
    `Welcome to TriGuard Roofing - Your Account Information`,
    welcomeEmailHtml
  );
};

const sendTaskAssignmentEmail = async (userData: any, taskData: any) => {
  const taskEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
          .button { background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Task Assigned</h1>
            <p>You have a new task to complete</p>
          </div>
          <div class="content">
            <p>Hi ${userData.first_name},</p>
            <p>A new task has been assigned to you by ${taskData.assigned_by}.</p>
            
            <div class="task-box">
              <h2 style="margin-top: 0; color: #667eea;">${taskData.task_title}</h2>
              ${taskData.task_description ? `<p>${taskData.task_description}</p>` : ''}
              <p style="color: #666; font-size: 14px; margin-top: 15px;">
                Please acknowledge this task in your onboarding portal.
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="https://your-portal-url.com" class="button">
                View Task in Portal
              </a>
            </div>
            
            <p style="margin-top: 30px; color: #666;">
              If you have any questions about this task, please contact your manager or the HR team.
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
    userData.personal_email || userData.generated_email,
    `New Task Assigned: ${taskData.task_title}`,
    taskEmailHtml
  );
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, user_data, task_data, admin_email }: NotificationRequest = await req.json();

    console.log(`Processing notification type: ${type}`);

    let emailResult;

    switch (type) {
      case 'admin_notification':
        if (!user_data) {
          throw new Error('user_data is required for admin_notification');
        }
        emailResult = await sendAdminNotification(user_data);
        break;

      case 'welcome_email':
        if (!user_data) {
          throw new Error('user_data is required for welcome_email');
        }
        emailResult = await sendWelcomeEmail(user_data);
        break;

      case 'task_assignment':
        if (!user_data || !task_data) {
          throw new Error('user_data and task_data are required for task_assignment');
        }
        emailResult = await sendTaskAssignmentEmail(user_data, task_data);
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    console.log('Email sent successfully:', emailResult);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notification sent successfully',
      result: emailResult 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-user-notifications function:", error);
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
