# Deploy na Vercel

Este projeto é TanStack Start. Em CI da Vercel, o build detecta a env
`VERCEL=1` automaticamente e o `vite.config.ts` ativa o preset `vercel`,
gerando o output serverless esperado sem afetar a publicação padrão do Lovable.

## 1. Subir o código

Conecte este projeto ao GitHub pelo menu **+ → GitHub → Connect project**
(o Lovable cria o repo e mantém sync bidirecional).

## 2. Criar o projeto na Vercel

1. Vercel → **Add New → Project** → importar o repo do GitHub.
2. Framework Preset: **Other** (o `vercel.json` deste repo cuida do resto).
3. Build Command: `bun run build` (já no `vercel.json`).
4. Output: deixe automático — o preset Nitro Vercel grava em `.vercel/output`.

## 3. Variáveis de ambiente (Project Settings → Environment Variables)

Marque cada uma para Production, Preview e Development:

**Públicas (client):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

**Servidor (somente runtime):**
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOVABLE_API_KEY` (se usar Lovable AI)
- `CARDAPIO_TOKEN`

Os valores estão em **Cloud → Settings** do Lovable (ou no Supabase dashboard).

## 4. Backend continua no Lovable Cloud

A Vercel só hospeda o front-end + server functions. Banco, auth e storage
seguem no Supabase gerenciado pelo Lovable.

Após o primeiro deploy, em **Cloud → Authentication → URL Configuration**
adicione o domínio da Vercel (`https://SEU-APP.vercel.app`) em:
- **Site URL**
- **Redirect URLs** (`https://SEU-APP.vercel.app/**`)

Sem isso o login Google quebra com erro de redirect.

## 5. Webhooks / rotas públicas

Rotas em `src/routes/api/public/*` viram funções serverless da Vercel
automaticamente — mesma URL, agora sob o domínio Vercel.
