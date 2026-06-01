import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arraiá da TI 🔥🌽 — Cardápio Caipira" },
      { name: "description", content: "Lista das comidas típicas do nosso Arraiá da TI: do pé de moleque ao quentão. Vem cair na quadrilha!" },
      { property: "og:title", content: "Arraiá da TI — Cardápio Caipira" },
      { property: "og:description", content: "Comidas típicas juninas servidas no arraiá do time de TI." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Rye&family=Caveat+Brush&family=Bree+Serif&display=swap" },
    ],
  }),
  component: Arraia,
});

type Comida = {
  nome: string;
  emoji: string;
  desc: string;
  categoria: "Salgado" | "Doce" | "Bebida";
  picante?: number; // 1-3 nível "caipirinha de tecnologia"
};

const cardapio: Comida[] = [
  { nome: "Milho Cozido", emoji: "🌽", desc: "Direto da espiga, com manteiga derretendo igual deploy na sexta.", categoria: "Salgado" },
  { nome: "Pamonha", emoji: "🫔", desc: "Doce ou salgada — sempre embrulhadinha igual código legado.", categoria: "Salgado" },
  { nome: "Cuscuz Nordestino", emoji: "🟡", desc: "Com manteiga e leite. Combustível pra refatorar até de madrugada.", categoria: "Salgado" },
  { nome: "Pastel de Forno", emoji: "🥟", desc: "Recheio surpresa, igual PR sem descrição.", categoria: "Salgado" },
  { nome: "Caldo Verde", emoji: "🥣", desc: "Quentinho pra esquentar até quem trabalha em ambiente de produção.", categoria: "Salgado" },
  { nome: "Canjica", emoji: "🍚", desc: "Branquinha, cremosa e com canela. O modo escuro da sobremesa.", categoria: "Doce" },
  { nome: "Arroz Doce", emoji: "🥛", desc: "Com cravo e canela. Loop infinito de colheradas.", categoria: "Doce" },
  { nome: "Pé de Moleque", emoji: "🥜", desc: "Amendoim + rapadura. Compilado e bem rígido.", categoria: "Doce" },
  { nome: "Paçoca", emoji: "🟫", desc: "Esfarela na boca igual sprint mal planejada.", categoria: "Doce" },
  { nome: "Bolo de Fubá", emoji: "🍰", desc: "Com erva-doce. Vai bem com café e code review.", categoria: "Doce" },
  { nome: "Maçã do Amor", emoji: "🍎", desc: "Brilhante e perigosa, igual feature flag em produção.", categoria: "Doce" },
  { nome: "Quentão", emoji: "🍷", desc: "Cachaça, gengibre e cravo. Roda pra esquentar a fogueira.", categoria: "Bebida", picante: 3 },
  { nome: "Vinho Quente", emoji: "🍇", desc: "Pra quem prefere a versão sommelier do quentão.", categoria: "Bebida", picante: 2 },
  { nome: "Suco de Milho Verde", emoji: "🥤", desc: "Sem álcool, mas com toda a vibe junina.", categoria: "Bebida", picante: 1 },
];

const categorias = ["Todos", "Salgado", "Doce", "Bebida"] as const;

function Arraia() {
  return (
    <div className="min-h-screen">
      <div className="bandeirinhas sway" aria-hidden />

      <header className="px-4 pt-10 pb-8 text-center">
        <p className="font-body text-2xl text-accent">É hora do arraiá!</p>
        <h1 className="mt-2 text-5xl md:text-7xl text-primary drop-shadow-[3px_3px_0_var(--color-foreground)]">
          Arraiá da TI 🔥
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-2xl text-foreground/80">
          Ocê chegou no cardápio mais cabôco do time! Bote o chapéu de palha,
          puxe a cadeira e veja o que vai rolar na fogueira:
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cardapio.map((c) => (
            <article
              key={c.nome}
              className="group relative rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_var(--color-foreground)] transition-transform hover:-translate-y-1 hover:rotate-[-0.5deg]"
            >
              <div className="absolute -top-3 left-4 rounded-full border-2 border-foreground bg-secondary px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                {c.categoria}
              </div>
              <div className="flex items-start gap-3">
                <span className="text-5xl flicker" aria-hidden>{c.emoji}</span>
                <div className="flex-1">
                  <h2 className="font-display text-2xl text-primary leading-tight">{c.nome}</h2>
                  {c.picante && (
                    <div className="mt-1 text-fire text-sm">
                      {"🌶️".repeat(c.picante)}
                      <span className="ml-1 text-muted-foreground font-body text-base">
                        nível esquenta-fogueira
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-3 font-body text-xl leading-snug text-foreground/80">
                {c.desc}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-3xl border-2 border-foreground bg-accent/90 p-8 text-center text-accent-foreground shadow-[8px_8px_0_var(--color-foreground)]">
          <h2 className="font-display text-4xl">🪗 Programação da Festança</h2>
          <ul className="mt-4 grid gap-2 font-body text-2xl sm:grid-cols-3">
            <li>19h — Abertura da fogueira 🔥</li>
            <li>20h — Quadrilha dos Devs 💃🕺</li>
            <li>21h — Casamento Caipira (do dev com a prod) 💍</li>
            <li>22h — Pescaria de bugs 🎣🐛</li>
            <li>23h — Show do sanfoneiro 🪗</li>
            <li>00h — Fogos e abraços 🎆</li>
          </ul>
        </section>

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
