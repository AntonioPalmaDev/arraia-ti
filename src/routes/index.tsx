import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arraiá da TI 🔥🌽 — Lista de Comidas" },
      { name: "description", content: "Quem traz o quê no Arraiá da TI? Confira a lista e coloque seu nome!" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Rye&family=Caveat+Brush&family=Bree+Serif&display=swap" },
      { rel: "icon", href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👒</text></svg>" },
    ],
  }),
  component: Arraia,
});

function Arraia() {
  const queryClient = useQueryClient();
  const TOKEN_CORRETO = "B4JchR0KHQHEQMzKq2uzsPKgiBLJJKV5c2t9kpWeOSOJhmRQvX1o4UesOLLwyIZS";
  
  // Estados para edição dos cards existentes
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  // Estados para a criação do NOVO prato extra
  const [novoPratoNome, setNovoPratoNome] = useState("");
  const [novoPratoResponsavel, setNovoPratoResponsavel] = useState("");

  // Busca a lista de pratos
  const { data: cardapio, isLoading } = useQuery({
    queryKey: ["cardapio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cardapio")
        .select("*")
        .order("categoria", { ascending: false })
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  // Mutation para atualizar o responsável por um prato
  const updateResponsavel = useMutation({
    mutationFn: async ({ id, responsavel }: { id: string; responsavel: string }) => {
      const { error } = await supabase
        .from("cardapio")
        .update({ responsavel })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardapio"] });
      setEditingId(null);
      setTempName("");
    },
  });

  // Mutation para criar um NOVO prato extra
  const addPrato = useMutation({
    mutationFn: async ({ nome, responsavel }: { nome: string; responsavel: string }) => {
      const { error } = await supabase
        .from("cardapio")
        .insert({
          nome,
          responsavel,
          categoria: "Outros",
          emoji: "🍽️",
          descricao: "Prato extra sugerido pela galera!"
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardapio"] });
      setNovoPratoNome("");
      setNovoPratoResponsavel("");
    },
  });

  // Mutation para EXCLUIR um prato
  const deletePrato = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cardapio")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardapio"] });
    },
  });

  const handleStartEditing = (id: string, currentResponsavel: string) => {
    if (!currentResponsavel) {
      setEditingId(id);
      setTempName("");
      return;
    }

    const token = prompt("Insira o token para alterar o nome:");
    if (token === TOKEN_CORRETO) {
      setEditingId(id);
      setTempName(currentResponsavel);
    } else if (token !== null) {
      alert("Token inválido! Ocê não tem permissão pra mexer aqui não.");
    }
  };

  const handleSave = (id: string) => {
    updateResponsavel.mutate({ id, responsavel: tempName });
  };

  const handleAddNovoPrato = () => {
    if (!novoPratoNome.trim()) {
      alert("Ocê precisa dar um nome pro prato pra poder colocar na mesa!");
      return;
    }
    addPrato.mutate({ nome: novoPratoNome, responsavel: novoPratoResponsavel });
  };

  // Função que lida com a exclusão validando o token
  const handleDeletePrato = (id: string, nomePrato: string) => {
    const token = prompt(`Insira o token para excluir o prato "${nomePrato}":`);
    
    if (token === TOKEN_CORRETO) {
      if (confirm(`Tem certeza que deseja tirar o prato "${nomePrato}" da mesa?`)) {
        deletePrato.mutate(id);
      }
    } else if (token !== null) {
      alert("Token inválido! Ocê não pode retirar esse prato da mesa não.");
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bandeirinhas sway" aria-hidden />

      <header className="px-4 pt-10 pb-8 text-center">
        <p className="font-body text-2xl text-accent">É hora do arraiá!</p>
        <h1 className="mt-2 text-5xl md:text-7xl text-primary drop-shadow-[3px_3px_0_var(--color-foreground)]">
          Arraiá da TI 🔥
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-2xl text-foreground/80">
          Ocê chegou na lista oficial das comilanças! <br/>
          Escolha o que vai trazer e coloque seu nome pra ninguém repetir.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        {isLoading ? (
          <div className="text-center font-body text-3xl text-primary py-20">
            Carregando o cardápio... 🌽
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cardapio?.map((c) => (
              <article
                key={c.id}
                className="group relative rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_var(--color-foreground)] transition-transform hover:-translate-y-1 hover:rotate-[-0.5deg]"
              >
                <div className="absolute -top-3 left-4 rounded-full border-2 border-foreground bg-secondary px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                  {c.categoria}
                </div>

                {/* BOTÃO DE EXCLUIR PROTEGIDO POR TOKEN (Só aparece para pratos da categoria "Outros") */}
                {c.categoria === "Outros" && (
                  <button
                    onClick={() => handleDeletePrato(c.id, c.nome)}
                    title="Excluir prato"
                    className="absolute -top-3 right-4 rounded-full border-2 border-foreground bg-destructive px-2 py-0.5 text-xs font-bold uppercase text-destructive-foreground hover:scale-105 transition-transform"
                  >
                    🗑️ Excluir
                  </button>
                )}
                
                <div className="flex items-start gap-3 mt-2">
                  <span className="text-5xl flicker" aria-hidden>{c.emoji}</span>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl text-primary leading-tight">{c.nome}</h2>
                  </div>
                </div>

                <p className="mt-3 font-body text-xl leading-snug text-foreground/80 h-14 overflow-hidden">
                  {c.descricao}
                </p>

                <div className="mt-4 border-t-2 border-dashed border-foreground/20 pt-4">
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Quem traz:
                  </p>
                  
                  {editingId === c.id ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full rounded-lg border-2 border-foreground bg-background px-3 py-1 font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(c.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => handleSave(c.id)}
                        disabled={updateResponsavel.isPending}
                        className="rounded-lg bg-primary px-3 py-1 text-primary-foreground font-bold hover:brightness-110 disabled:opacity-50"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => handleStartEditing(c.id, c.responsavel || "")}
                      className="cursor-pointer group/name relative flex items-center justify-between rounded-lg border-2 border-transparent bg-secondary/20 px-3 py-1 font-body text-2xl text-foreground transition-all hover:border-foreground/50 hover:bg-secondary/40"
                    >
                      <span className={c.responsavel ? "text-primary" : "text-foreground/40 italic text-xl"}>
                        {c.responsavel || "Ninguém ainda..."}
                      </span>
                      <span className="text-sm opacity-0 group-hover/name:opacity-100 transition-opacity">
                        ✎
                      </span>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {/* CARD PARA ADICIONAR NOVO PRATO */}
            <article className="group relative rounded-2xl border-4 border-dashed border-foreground/30 bg-card/60 p-5 transition-transform hover:-translate-y-1 hover:rotate-[0.5deg]">
              <div className="absolute -top-3 left-4 rounded-full border-2 border-foreground bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                Sugerir Extra
              </div>
              
              <div className="flex flex-col h-full gap-4 pt-3">
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                    Nome do Prato
                  </label>
                  <input
                    type="text"
                    value={novoPratoNome}
                    onChange={(e) => setNovoPratoNome(e.target.value)}
                    placeholder="Ex: Torta de Frango"
                    className="w-full rounded-lg border-2 border-foreground bg-background px-3 py-2 font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                    Quem traz (Opcional)
                  </label>
                  <input
                    type="text"
                    value={novoPratoResponsavel}
                    onChange={(e) => setNovoPratoResponsavel(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-lg border-2 border-foreground bg-background px-3 py-2 font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddNovoPrato();
                    }}
                  />
                </div>

                <div className="mt-auto pt-4 border-t-2 border-dashed border-foreground/20">
                  <button
                    onClick={handleAddNovoPrato}
                    disabled={addPrato.isPending}
                    className="w-full rounded-lg bg-primary px-4 py-2 font-body text-xl text-primary-foreground font-bold hover:brightness-110 disabled:opacity-50 border-2 border-foreground shadow-[4px_4px_0_var(--color-foreground)] active:translate-y-1 active:shadow-none transition-all"
                  >
                    {addPrato.isPending ? "Criando..." : "Adicionar na Mesa ➕"}
                  </button>
                </div>
              </div>
            </article>
          </section>
        )}

        <div className="mt-12 checker-border h-6 rounded-full border-2 border-foreground" />

        <footer className="mt-10 text-center font-body text-xl text-muted-foreground">
          Cuidado pra não tropeçar no cabo de rede da fogueira. <br />
          Feito com 💛 pelo time de TI.
        </footer>
      </main>

      <div className="bandeirinhas sway" aria-hidden />
    </div>
  );
}