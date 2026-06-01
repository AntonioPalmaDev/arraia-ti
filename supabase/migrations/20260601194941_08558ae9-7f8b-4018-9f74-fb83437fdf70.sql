-- Create cardapio table
CREATE TABLE public.cardapio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  emoji TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  responsavel TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cardapio ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.cardapio TO anon;
GRANT ALL ON public.cardapio TO service_role;

-- Policies (Publicly viewable and editable for the arraia)
CREATE POLICY "Anyone can view the cardapio" ON public.cardapio FOR SELECT USING (true);
CREATE POLICY "Anyone can insert into cardapio" ON public.cardapio FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update responsavel" ON public.cardapio FOR UPDATE USING (true);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cardapio_updated_at
BEFORE UPDATE ON public.cardapio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
