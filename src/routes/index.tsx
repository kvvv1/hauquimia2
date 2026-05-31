import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { products, categories, type Category } from "@/data/products";
import { ProductItem } from "@/components/ProductItem";
import LOGO from "@/assets/logo-remove.png";
import ICON from "@/assets/icon.png";

/* ── Helpers ── */
function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}

const anim = (name: string, ms: number, delay = 0): React.CSSProperties => ({
  animation: `${name} ${ms}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
});

const PILL: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 300,
  fontSize: "0.65rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
};

/* ── Intro overlay ── */
function IntroOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  useEffect(() => {
    const hold = setTimeout(() => setPhase("hold"), 1200);
    const out  = setTimeout(() => setPhase("out"),  3000);
    const done = setTimeout(onDone,                  3900);
    return () => { clearTimeout(hold); clearTimeout(out); clearTimeout(done); };
  }, [onDone]);
  return (
    <div
      onClick={() => { setPhase("out"); setTimeout(onDone, 800); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "var(--hq-navy)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 800ms cubic-bezier(0.4,0,1,1)" : "none",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      <img src={LOGO} alt="Haquímia" style={{
        width: 280, height: 280, objectFit: "contain",
        opacity: phase === "in" ? 0 : 1,
        transform: phase === "in" ? "translateY(20px) scale(0.97)" : "translateY(0) scale(1)",
        transition: "opacity 1100ms cubic-bezier(0.16,1,0.3,1), transform 1100ms cubic-bezier(0.16,1,0.3,1)",
      }} />
      <p style={{
        fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.55rem",
        letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,144,42,0.75)",
        marginTop: 8, opacity: phase === "in" ? 0 : 1,
        transition: "opacity 900ms cubic-bezier(0.16,1,0.3,1) 400ms",
      }}>
        Joalheria artesanal brasileira
      </p>
      <div style={{
        height: 1, backgroundColor: "var(--hq-gold)", opacity: 0.4, marginTop: 28,
        width: phase === "in" ? 0 : 40,
        transition: "width 800ms cubic-bezier(0.16,1,0.3,1) 600ms",
      }} />
    </div>
  );
}

/* ── Category heading with scroll reveal ── */
function CategoryHeading({ cat }: { cat: { id: string; label: string; title: string } }) {
  const [ref, visible] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="mb-16">
      <p style={{ ...PILL, color: "var(--hq-gold)", letterSpacing: "0.3em", ...(visible ? anim("hq-rise-sm", 700) : { opacity: 0 }) }}>
        {cat.label}
      </p>
      <h2 style={{
        fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
        fontSize: "clamp(3rem, 6vw, 6rem)", color: "var(--hq-dark)", lineHeight: 1.05, marginTop: 10,
        ...(visible ? anim("hq-rise", 800, 80) : { opacity: 0 }),
      }}>
        {cat.title}
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
        <div style={{ width: 28, height: 2, backgroundColor: "var(--hq-navy)", transformOrigin: "left", transform: visible ? "scaleX(1)" : "scaleX(0)", transition: "transform 600ms cubic-bezier(0.16,1,0.3,1) 300ms" }} />
        <div style={{ width: 5, height: 5, transform: "rotate(45deg)", backgroundColor: "var(--hq-gold)", opacity: visible ? 0.8 : 0, transition: "opacity 400ms ease 600ms" }} />
      </div>
    </div>
  );
}

/* ── Sobre section ── */
function SobreSection() {
  const [ref, visible] = useInView<HTMLElement>(0.15);
  return (
    <section ref={ref} style={{ marginTop: 160, backgroundColor: "var(--hq-navy)", padding: "80px 24px" }}>
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p style={{ ...PILL, color: "var(--hq-gold)", letterSpacing: "0.3em", ...(visible ? anim("hq-rise-sm", 700) : { opacity: 0 }) }}>
            Sobre o ateliê
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: "#ffffff", lineHeight: 1.1, marginTop: 14,
            ...(visible ? anim("hq-rise", 900, 150) : { opacity: 0 }),
          }}>
            Feito à mão,<br />peça por peça
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.88rem",
            color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: 24, maxWidth: 460,
            ...(visible ? anim("hq-rise-sm", 800, 300) : { opacity: 0 }),
          }}>
            A Haquímia nasceu da vontade de criar joias que carregam história. Cada peça é
            desenvolvida artesanalmente em prata 925 com banho de ouro, pensada a partir de
            uma conversa — porque acreditamos que a joia mais bonita é aquela feita para você.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 32, ...(visible ? anim("hq-fade", 600, 500) : { opacity: 0 }) }}>
            <div style={{ width: 28, height: 2, backgroundColor: "var(--hq-gold)" }} />
            <div style={{ width: 5, height: 5, transform: "rotate(45deg)", backgroundColor: "var(--hq-gold)", opacity: 0.7 }} />
          </div>
          <div style={{ marginTop: 28, ...(visible ? anim("hq-rise-sm", 700, 600) : { opacity: 0 }) }}>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
              5,0 ★★★★★ · 15 avaliações no Google
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Ourives · Belo Horizonte, MG
            </p>
          </div>
        </div>
        <div style={{ ...(visible ? anim("hq-rise", 900, 200) : { opacity: 0 }) }}>
          <img src={LOGO} alt="Haquímia" style={{ width: "100%", maxWidth: 320, height: 320, objectFit: "contain", margin: "0 auto", display: "block" }} />
        </div>
      </div>
    </section>
  );
}

/* ── Contato & Mapa section ── */
function ContatoSection() {
  const [ref, visible] = useInView<HTMLElement>(0.1);
  return (
    <section ref={ref}>
      <div className="mx-auto max-w-[1280px] px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <p style={{ ...PILL, color: "var(--hq-gold)", letterSpacing: "0.3em", ...(visible ? anim("hq-rise-sm", 700) : { opacity: 0 }) }}>
            Visita & contato
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "var(--hq-dark)", lineHeight: 1.1, marginTop: 14,
            ...(visible ? anim("hq-rise", 900, 100) : { opacity: 0 }),
          }}>
            Venha nos visitar
          </h2>

          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 24, ...(visible ? anim("hq-rise-sm", 800, 250) : { opacity: 0 }) }}>
            <div>
              <p style={{ ...PILL, fontSize: "0.58rem", color: "var(--hq-gold)", letterSpacing: "0.25em", marginBottom: 6 }}>Endereço</p>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.85rem", color: "var(--hq-dark)", lineHeight: 1.6 }}>
                R. São Paulo, 1665 — Lourdes<br />Belo Horizonte · MG · 30170-132
              </p>
            </div>
            <div>
              <p style={{ ...PILL, fontSize: "0.58rem", color: "var(--hq-gold)", letterSpacing: "0.25em", marginBottom: 6 }}>Telefone</p>
              <a href="tel:+5531990621354" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.85rem", color: "var(--hq-dark)", textDecoration: "none", borderBottom: "1px solid var(--hq-gold)" }}>
                (31) 99062-1354
              </a>
            </div>
            <div>
              <p style={{ ...PILL, fontSize: "0.58rem", color: "var(--hq-gold)", letterSpacing: "0.25em", marginBottom: 10 }}>Horário</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {([
                  ["Segunda — Sexta", "09:00 – 18:00"],
                  ["Sábado", "Fechado"],
                  ["Domingo", "Fechado"],
                ] as [string, string][]).map(([day, hours]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", maxWidth: 300, fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--hq-muted)" }}>{day}</span>
                    <span style={{ color: hours === "Fechado" ? "var(--hq-muted)" : "var(--hq-dark)" }}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/553190621354"
            target="_blank" rel="noopener"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 36,
              backgroundColor: "var(--hq-navy)", color: "#fff", padding: "14px 28px",
              fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.65rem",
              letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none",
              ...(visible ? anim("hq-rise-sm", 700, 450) : { opacity: 0 }),
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Falar no WhatsApp
          </a>
        </div>

        <div style={{ ...(visible ? anim("hq-rise", 900, 300) : { opacity: 0 }) }}>
          <div style={{ border: "3px solid var(--hq-navy)", overflow: "hidden" }}>
            <iframe
              title="Haquímia no Google Maps"
              src="https://maps.google.com/maps?q=R.+S%C3%A3o+Paulo%2C+1665%2C+Lourdes%2C+Belo+Horizonte%2C+MG%2C+30170-132&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="380"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.65rem", color: "var(--hq-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 12, textAlign: "center" }}>
            R. São Paulo, 1665 — Lourdes, BH
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Route ── */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haquímia — Joias artesanais em ouro" },
      { name: "description", content: "Haquímia — joias artesanais brasileiras em prata 925 com banho de ouro. Peças personalizadas criadas a partir de uma conversa." },
      { property: "og:title", content: "Haquímia — Joias artesanais em ouro" },
      { property: "og:description", content: "Joias artesanais brasileiras. Peças personalizadas, do seu jeito." },
    ],
  }),
  component: Index,
});

type Filter = "todos" | Category;

const filterPills: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "brincos", label: "Brincos" },
  { id: "colares", label: "Colares" },
  { id: "pulseiras", label: "Pulseiras" },
];

const WA_CUSTOM = "https://wa.me/553190621354?text=Olá!%20Gostaria%20de%20criar%20uma%20joia%20personalizada%20na%20Haquímia.";

function Index() {
  const [introVisible, setIntroVisible] = useState(true);
  const [active, setActive] = useState<Filter>("todos");
  const [scrolled, setScrolled] = useState(false);
  const [ctaRef, ctaVisible] = useInView<HTMLElement>(0.15);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFilter = (id: Filter) => {
    setActive(id);
    if (id !== "todos") {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div style={{ backgroundColor: "var(--hq-white)", color: "var(--hq-dark)", minHeight: "100vh" }}>
      {introVisible && <IntroOverlay onDone={() => setIntroVisible(false)} />}

      {/* Navy top bar */}
      <div style={{ height: 3, backgroundColor: "var(--hq-navy)", ...anim("hq-fade", 600) }} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: "var(--hq-white)", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent", transition: "border-color 300ms ease", ...anim("hq-fade", 500, 100) }}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3">
          <a href="#" onClick={(e) => { e.preventDefault(); handleFilter("todos"); }} style={{ display: "flex", alignItems: "center" }}>
            <img src={ICON} alt="Haquímia" style={{ height: 44, width: 44, objectFit: "contain" }} />
          </a>
          <nav className="flex items-center gap-7">
            {filterPills.map((p) => (
              <button key={p.id} onClick={() => handleFilter(p.id)} className={`hq-nav-btn${active === p.id ? " active" : ""}`} style={{ ...PILL, color: active === p.id ? "var(--hq-navy)" : "var(--hq-muted)", transition: "color 200ms ease", border: "none", background: "none", cursor: "pointer" }}>
                {p.label}
              </button>
            ))}
          </nav>
          <a href={WA_CUSTOM} target="_blank" rel="noopener" className="hq-nav-btn" style={{ ...PILL, color: "var(--hq-navy)" }}>
            Encomendar
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center mx-auto max-w-[1280px] px-6 pt-20 pb-12">
        <div style={anim("hq-rise", 1000, 100)}>
          <img src={LOGO} alt="Haquímia" style={{ width: 240, height: 240, objectFit: "contain" }} />
        </div>
        <p style={{ ...PILL, color: "var(--hq-gold)", letterSpacing: "0.3em", marginTop: 24, ...anim("hq-rise-sm", 800, 400) }}>
          Joalheria artesanal brasileira
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--hq-dark)", lineHeight: 1.05, marginTop: 16, ...anim("hq-rise", 1000, 550) }}>
          Peças que contam histórias
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.9rem", color: "var(--hq-muted)", maxWidth: 500, margin: "24px auto 0", lineHeight: 1.7, ...anim("hq-rise-sm", 900, 750) }}>
          Cada joia é pensada para acompanhar um momento. Prata 925, banho de ouro e o cuidado de quem cria à mão.
        </p>
        <div style={{ width: 40, height: 1, backgroundColor: "var(--hq-gold)", marginTop: 40, opacity: 0.5, ...anim("hq-fade", 600, 1000) }} />
      </section>

      {/* ── Products ── */}
      <main className="mx-auto max-w-[1280px] px-6">
        {categories.map((cat) => {
          const items = products.filter((p) => p.category === cat.id);
          const hidden = active !== "todos" && active !== cat.id;
          return (
            <section key={cat.id} id={cat.id} style={{ marginTop: 140, opacity: hidden ? 0 : 1, pointerEvents: hidden ? "none" : "auto", height: hidden ? 0 : "auto", overflow: hidden ? "hidden" : "visible", transition: "opacity 300ms ease" }}>
              <CategoryHeading cat={cat} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ columnGap: 48, rowGap: 80 }}>
                {items.map((product, i) => (
                  <ProductItem key={product.id} product={product} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* ── Sobre ── */}
      <SobreSection />

      {/* ── Contato & Mapa ── */}
      <ContatoSection />

      {/* ── CTA ── */}
      <section ref={ctaRef} className="flex flex-col items-center text-center" style={{ backgroundColor: "var(--hq-navy)", padding: "100px 24px", marginTop: 0 }}>
        <div style={ctaVisible ? anim("hq-rise", 900, 0) : { opacity: 0 }}>
          <img src={LOGO} alt="Haquímia" style={{ width: 200, height: 200, objectFit: "contain" }} />
        </div>
        <p style={{ ...PILL, fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--hq-gold)", marginTop: 16, ...(ctaVisible ? anim("hq-rise-sm", 700, 200) : { opacity: 0 }) }}>
          Peças personalizadas
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#ffffff", lineHeight: 1.1, marginTop: 16, ...(ctaVisible ? anim("hq-rise", 900, 350) : { opacity: 0 }) }}>
          Não encontrou o que procura?
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", maxWidth: 440, margin: "20px auto 0", lineHeight: 1.7, ...(ctaVisible ? anim("hq-rise-sm", 800, 500) : { opacity: 0 }) }}>
          Criamos a partir de uma conversa. Cada detalhe, do seu jeito.
        </p>
        <a
          href={WA_CUSTOM} target="_blank" rel="noopener" className="mt-10 inline-block"
          style={{ backgroundColor: "var(--hq-gold)", color: "#ffffff", padding: "18px 52px", fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "filter 250ms ease, transform 250ms ease", ...(ctaVisible ? anim("hq-rise-sm", 700, 650) : { opacity: 0 }) }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.12)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = ""; (e.currentTarget as HTMLAnchorElement).style.transform = ""; }}
        >
          Falar no WhatsApp
        </a>
      </section>

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center gap-3 text-center" style={{ backgroundColor: "var(--hq-white)", borderTop: "3px solid var(--hq-navy)", padding: "36px 24px", fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--hq-muted)" }}>
        <img src={ICON} alt="" style={{ height: 32, width: 32, objectFit: "contain", opacity: 0.55 }} />
        Haquímia · Joalheria artesanal · Belo Horizonte, MG
      </footer>
    </div>
  );
}
