import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Assumindo que você usa o Sonner para toasts, conforme seus arquivos
import { el } from "date-fns/locale";

interface OutrosPratosCardProps {
  // Se passar um ID, o card entra em modo de edição
  pratoId?: string; 
  initialPrato?: string;
  initialResponsavel?: string;
  onSuccess?: () => void; // Callback para recarregar a lista após salvar
}

export function OutrosPratosCard({
  pratoId,
  initialPrato = "",
  initialResponsavel = "",
  onSuccess,
}: OutrosPratosCardProps) {
  const [prato, setPrato] = useState(initialPrato);
  const [responsavel, setResponsavel] = useState(initialResponsavel);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!prato.trim() || !responsavel.trim()) {
      toast.error("Preencha o nome do prato e o responsável!");
      return;
    }

    setIsSaving(true);

    try {
      if (pratoId) {
        // Atualiza o prato existente
        const { error } = await supabase
          .from("outros_pratos")
          .update({ prato, responsavel })
          .eq("id", pratoId);

        if (error) throw error;
        toast.success("Prato atualizado com sucesso!");
      } else {
        // Salva um novo prato
        const { error } = await supabase
          .from("outros_pratos")
          .insert([{ prato, responsavel }]);

        if (error) throw error;
        toast.success("Prato adicionado com sucesso!");
        
        // Limpa os campos após criar um novo
        setPrato("");
        setResponsavel("");
      }

      // Atualiza a interface pai, se necessário (ex: refetch da lista)
      if (onSuccess) onSuccess();

    } catch (error: any) {
      console.error("Erro ao salvar prato:", error);
      toast.error("Ocorreu um erro ao salvar os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md mt-6">
      <CardHeader>
        <CardTitle>{pratoId ? "Editar Prato" : "Adicionar Outro Prato"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prato">Nome do Prato</Label>
          <Input
            id="prato"
            placeholder="Ex: Bolo de Milho"
            value={prato}
            onChange={(e) => setPrato(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsavel">Responsável por trazer</Label>
          <Input
            id="responsavel"
            placeholder="Ex: João Silva"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar Prato"}
        </Button>
      </CardFooter>
    </Card>
  );
}