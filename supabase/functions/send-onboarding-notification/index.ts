import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  employeeName: string;
  employeeEmail: string;
  managerEmail: string;
  formData: any;
}

const sendEmail = async (to: string, subject: string, html: string) => {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "TriGuard Onboarding <onboarding@thspros.com>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { employeeName, employeeEmail, managerEmail, formData }: NotificationRequest = await req.json();

    console.log('Sending onboarding notification via Resend for:', employeeName);

    // Send notification to manager
    await sendEmail(
      managerEmail,
      `New Employee Onboarding Completed - ${employeeName}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Employee Onboarding Completed
          </h1>
          
          <p>Hello,</p>
          
          <p><strong>${employeeName}</strong> has completed their onboarding process and is ready to begin training.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Employee Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${formData.first_name} ${formData.last_name}</li>
              <li><strong>Generated Email:</strong> ${employeeEmail}</li>
              <li><strong>Gender:</strong> ${formData.gender}</li>
              <li><strong>Shirt Size:</strong> ${formData.shirt_size}</li>
              <li><strong>Coat Size:</strong> ${formData.coat_size}</li>
              <li><strong>Pant Size:</strong> ${formData.pant_size}</li>
              <li><strong>Shoe Size:</strong> ${formData.shoe_size}</li>
              <li><strong>Hat Size:</strong> ${formData.hat_size}</li>
            </ul>
          </div>
          
          <p>Please reach out to ${employeeName} to schedule their training and provide them with their work schedule.</p>
          
          <p>Best regards,<br>
          TriGuard Roofing HR Team</p>
        </div>
      `
    );

    // Send notification to onboarding team
    await sendEmail(
      "onboarding@triguardroofing.com",
      `Onboarding Form Submitted - ${employeeName}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Onboarding Form Submitted
          </h1>
          
          <p>A new onboarding form has been submitted:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Employee Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${formData.first_name} ${formData.last_name}</li>
              <li><strong>Generated Email:</strong> ${employeeEmail}</li>
              <li><strong>Manager:</strong> ${managerEmail}</li>
              <li><strong>Address:</strong> ${formData.street_address}, ${formData.city}, ${formData.state} ${formData.zip_code}</li>
              <li><strong>W9 Completed:</strong> ${formData.w9_completed ? 'Yes' : 'No'}</li>
              <li><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p>Please review the submission and prepare necessary materials for the new hire.</p>
          
          <p>Best regards,<br>
          TriGuard Onboarding System</p>
        </div>
      `
    );

    console.log("Notification emails sent successfully via Resend");

    return new Response(JSON.stringify({
      success: true,
      message: "Emails sent via Resend"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-onboarding-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);