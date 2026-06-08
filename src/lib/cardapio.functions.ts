import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.string().min(1).max(256);

function assertToken(token: string) {
  const expected = process.env.CARDAPIO_TOKEN;
  if (!expected) {
    throw new Error("CARDAPIO_TOKEN não configurado no servidor.");
  }
  // constant-time-ish comparison
  if (token.length !== expected.length) {
    throw new Error("Token inválido.");
  }
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (mismatch !== 0) {
    throw new Error("Token inválido.");
  }
}

export const updateResponsavelFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; responsavel: string; token: string }) =>
    z
      .object({
        id: z.string().uuid(),
        responsavel: z.string().trim().max(80),
        token: tokenSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    assertToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("cardapio")
      .update({ responsavel: data.responsavel || null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addPratoFn = createServerFn({ method: "POST" })
  .inputValidator((input: { nome: string; responsavel: string }) =>
    z
      .object({
        nome: z.string().trim().min(1).max(80),
        responsavel: z.string().trim().max(80),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("cardapio").insert({
      nome: data.nome,
      responsavel: data.responsavel || null,
      categoria: "Outros",
      emoji: "🍽️",
      descricao: "Prato extra sugerido pela galera!",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePratoFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; token: string }) =>
    z.object({ id: z.string().uuid(), token: tokenSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    assertToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("cardapio").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
