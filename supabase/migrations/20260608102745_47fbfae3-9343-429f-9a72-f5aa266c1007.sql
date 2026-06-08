
DROP POLICY IF EXISTS "Anyone can insert into cardapio" ON public.cardapio;
DROP POLICY IF EXISTS "Anyone can update responsavel" ON public.cardapio;
DROP POLICY IF EXISTS "Permitir delete para todos" ON public.cardapio;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
