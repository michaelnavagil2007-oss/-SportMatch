
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const systemPrompt = `
Eres SportMatch AI, asistente oficial de SportMatch.

SportMatch conecta deportistas, entrenadores y clubes.

Funciones disponibles:
- Registro e inicio de sesión.
- Perfiles deportivos.
- Exploración de talentos con filtros.
- Catálogo de servicios.
- Formulario de contacto.

Ayuda a los usuarios a:
- Utilizar la plataforma.
- Encontrar perfiles deportivos.
- Mejorar la información de sus perfiles.
- Comprender conceptos generales de entrenamiento.

Responde en español, con claridad y brevedad.
No inventes clubes, convocatorias ni oportunidades.
No afirmes acceder a perfiles o datos privados.
No proporciones diagnósticos médicos.
`;

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Método no permitido." }, 405);
  }

  try {
    // 1. Verificar credenciales del usuario
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Inicia sesión primero." }, 401);
    }

    const token = authHeader.slice(7);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return json({ error: "Configuración incompleta." }, 500);
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: authData, error: authError } =
      await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return json({ error: "Sesión no válida." }, 401);
    }

    // 2. Validar la pregunta
    let body: { message?: unknown };

    try {
      body = await req.json();
    } catch {
      return json({ error: "Solicitud inválida." }, 400);
    }

    const message = body?.message;

    if (
      typeof message !== "string" ||
      message.trim().length < 2 ||
      message.length > 1000
    ) {
      return json(
        { error: "La pregunta debe tener entre 2 y 1000 caracteres." },
        400
      );
    }

    // 3. Comprobar el límite diario
    const { data: allowed, error: limitError } =
      await supabase.rpc("reserve_ai_request");

    if (limitError) {
      console.error("Error de límite:", limitError.message);
      return json(
        { error: "No se pudo verificar el límite de uso." },
        500
      );
    }

    if (!allowed) {
      return json(
        { error: "Alcanzaste tus 10 preguntas diarias." },
        429
      );
    }

    // 4. Obtener la clave privada
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return json(
        { error: "La IA no está configurada." },
        500
      );
    }

    // 5. Consultar al modelo de IA
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: systemPrompt,
          input: message.trim(),
          max_output_tokens: 400,
          store: false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Error OpenAI:",
        response.status,
        data.error?.message
      );

      return json(
        { error: "No se pudo obtener una respuesta de la IA." },
        502
      );
    }

    const reply = (data.output ?? [])
      .flatMap((item: any) => item.content ?? [])
      .filter((part: any) => part.type === "output_text")
      .map((part: any) => part.text)
      .join("\n")
      .trim();

    return json({
      reply: reply || "No pude generar una respuesta.",
    });
  } catch (error) {
    console.error("SportMatch AI:", error);

    return json(
      { error: "Error al procesar la solicitud." },
      500
    );
  }
});
