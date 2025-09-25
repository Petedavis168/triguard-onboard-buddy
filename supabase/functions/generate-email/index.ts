import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  firstName: string;
  lastName: string;
}

const normalizeString = (str: string): string => {
  return str.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20); // Limit length to avoid very long emails
};

const generateEmailAddress = async (firstName: string, lastName: string): Promise<string> => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const normalizedFirst = normalizeString(firstName);
  const normalizedLast = normalizeString(lastName);
  
  const baseEmail = `${normalizedFirst}.${normalizedLast}@triguardroofing.com`;
  
  // Check if email already exists
  const { data: existingEmail, error: checkError } = await supabase
    .from('email_addresses')
    .select('email')
    .eq('email', baseEmail)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(`Error checking email existence: ${checkError.message}`);
  }

  if (!existingEmail) {
    // Email doesn't exist, save it and return
    const { error: insertError } = await supabase
      .from('email_addresses')
      .insert({
        email: baseEmail,
        first_name: firstName,
        last_name: lastName,
        is_active: true
      });

    if (insertError) {
      throw new Error(`Error saving email: ${insertError.message}`);
    }

    return baseEmail;
  }

  // Email exists, try variations
  for (let i = 1; i <= 99; i++) {
    const variantEmail = `${normalizedFirst}.${normalizedLast}${i}@triguardroofing.com`;
    
    const { data: existingVariant } = await supabase
      .from('email_addresses')
      .select('email')
      .eq('email', variantEmail)
      .maybeSingle();

    if (!existingVariant) {
      // This variant doesn't exist, save it and return
      const { error: insertError } = await supabase
        .from('email_addresses')
        .insert({
          email: variantEmail,
          first_name: firstName,
          last_name: lastName,
          is_active: true
        });

      if (insertError) {
        throw new Error(`Error saving email: ${insertError.message}`);
      }

      return variantEmail;
    }
  }

  throw new Error('Unable to generate unique email address');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName }: EmailRequest = await req.json();

    if (!firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: "firstName and lastName are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('Generating email for:', firstName, lastName);

    const email = await generateEmailAddress(firstName, lastName);

    console.log('Generated email:', email);

    return new Response(JSON.stringify({
      success: true,
      email: email
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in generate-email function:", error);
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