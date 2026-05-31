import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { products, categories, type Category } from "@/data/products";
import { ProductItem } from "@/components/ProductItem";
import LOGO from "@/assets/logo-remove.png";
import ICON from "@/assets/icon.png";

/* Fires once when the element enters the viewport */
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

/* Inline animation helper */
const anim = (name: string, ms: number, delay = 0): React.CSSProperties => ({
  animation: `${name} ${ms}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
});

/* Category heading block — reveals as it scrolls into view */
function CategoryHeading({ cat }: { cat: { id: string; label: string; title: string } }) {
  const [ref, visible] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="mb-16">
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--hq-gold)",
          ...(visible ? anim("hq-rise-sm", 700) : { opacity: 0 }),
        }}
      >
        {cat.label}
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(3rem, 6vw, 6rem)",
          color: "var(--hq-dark)",
          lineHeight: 1.05,
          marginTop: 10,
          ...(visible ? anim("hq-rise", 800, 80) : { opacity: 0 }),
        }}
      >
        {cat.title}
      </h2>
      {/* Animated navy + gold divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
        <div
          style={{
            width: 28,
            height: 2,
            backgroundColor: "var(--hq-navy)",
            transformOrigin: "left",
            transform: visible ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 600ms cubic-bezier(0.16,1,0.3,1) 300ms",
          }}
        />
        <div
          style={{
            width: 5,
            height: 5,
            transform: "rotate(45deg)",
            backgroundColor: "var(--hq-gold)",
            opacity: visible ? 0.8 : 0,
            transition: "opacity 400ms ease 600ms",
          }}
        />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haquímia — Joias artesanais em ouro" },
      {
        name: "description",
        content:
          "Haquímia — joias artesanais brasileiras em prata 925 com banho de ouro. Peças personalizadas criadas a partir de uma conversa.",
      },
      { property: "og:title", content: "Haquímia — Joias artesanais em ouro" },
      {
        property: "og:description",
        content: "Joias artesanais brasileiras. Peças personalizadas, do seu jeito.",
      },
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

const WA_CUSTOM =
  "https://wa.me/553190621354?text=Olá!%20Gostaria%20de%20criar%20uma%20joia%20personalizada%20na%20Haquímia.";

function Index() {
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
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const pill: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontWeight: 300,
    fontSize: "0.65rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  };

  return (
    <div style={{ backgroundColor: "var(--hq-white)", color: "var(--hq-dark)", minHeight: "100vh" }}>

      {/* Navy top bar — slides in from left on load */}
      <div
        style={{
          height: 3,
          backgroundColor: "var(--hq-navy)",
          ...anim("hq-fade", 600),
        }}
      />

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "var(--hq-white)",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent",
          transition: "border-color 300ms ease",
          ...anim("hq-fade", 500, 100),
        }}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleFilter("todos"); }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img src={ICON} alt="Haquímia" style={{ height: 44, width: 44, objectFit: "contain" }} />
          </a>

          <nav className="flex items-center gap-7">
            {filterPills.map((p) => (
              <button
                key={p.id}
                onClick={() => handleFilter(p.id)}
                className={`hq-nav-btn${active === p.id ? " active" : ""}`}
                style={{
                  ...pill,
                  color: active === p.id ? "var(--hq-navy)" : "var(--hq-muted)",
                  transition: "color 200ms ease",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {p.label}
              </button>
            ))}
          </nav>

          <a
            href={WA_CUSTOM}
            target="_blank"
            rel="noopener"
            className="hq-nav-btn"
            style={{ ...pill, color: "var(--hq-navy)" }}
          >
            Encomendar
          </a>
        </div>
      </header>

      {/* ── Hero / Intro — staggered entrance ── */}
      <section className="flex flex-col items-center text-center mx-auto max-w-[1280px] px-6 pt-20 pb-12">

        <div style={anim("hq-rise", 1000, 100)}>
          <img src={LOGO} alt="Haquímia" style={{ width: 240, height: 240, objectFit: "contain" }} />
        </div>

        <p
          style={{
            ...pill,
            color: "var(--hq-gold)",
            letterSpacing: "0.3em",
            fontSize: "0.65rem",
            marginTop: 24,
            ...anim("hq-rise-sm", 800, 400),
          }}
        >
          Joalheria artesanal brasileira
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(3rem, 8vw, 6rem)",
            color: "var(--hq-dark)",
            lineHeight: 1.05,
            marginTop: 16,
            ...anim("hq-rise", 1000, 550),
          }}
        >
          Peças que contam histórias
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.9rem",
            color: "var(--hq-muted)",
            maxWidth: 500,
            margin: "24px auto 0",
            lineHeight: 1.7,
            ...anim("hq-rise-sm", 900, 750),
          }}
        >
          Cada joia é pensada para acompanhar um momento. Prata 925, banho de ouro e o cuidado de
          quem cria à mão.
        </p>

        {/* Gold divider line animates in last */}
        <div
          style={{
            width: 40,
            height: 1,
            backgroundColor: "var(--hq-gold)",
            marginTop: 40,
            opacity: 0.5,
            ...anim("hq-fade", 600, 1000),
          }}
        />
      </section>

      {/* ── Category sections ── */}
      <main className="mx-auto max-w-[1280px] px-6">
        {categories.map((cat) => {
          const items = products.filter((p) => p.category === cat.id);
          const hidden = active !== "todos" && active !== cat.id;
          return (
            <section
              key={cat.id}
              id={cat.id}
              style={{
                marginTop: 140,
                opacity: hidden ? 0 : 1,
                pointerEvents: hidden ? "none" : "auto",
                height: hidden ? 0 : "auto",
                overflow: hidden ? "hidden" : "visible",
                transition: "opacity 300ms ease",
              }}
            >
              <CategoryHeading cat={cat} />

              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                style={{ columnGap: 48, rowGap: 80 }}
              >
                {items.map((product, i) => (
                  <ProductItem key={product.id} product={product} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* ── CTA Banner — staggered reveal on scroll ── */}
      <section
        ref={ctaRef}
        className="flex flex-col items-center text-center"
        style={{ backgroundColor: "var(--hq-navy)", padding: "100px 24px", marginTop: 160 }}
      >
        <div style={ctaVisible ? anim("hq-rise", 900, 0) : { opacity: 0 }}>
          <img src={LOGO} alt="Haquímia" style={{ width: 200, height: 200, objectFit: "contain" }} />
        </div>

        <p
          style={{
            ...pill,
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            color: "var(--hq-gold)",
            marginTop: 16,
            ...(ctaVisible ? anim("hq-rise-sm", 700, 200) : { opacity: 0 }),
          }}
        >
          Peças personalizadas
        </p>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            color: "#ffffff",
            lineHeight: 1.1,
            marginTop: 16,
            ...(ctaVisible ? anim("hq-rise", 900, 350) : { opacity: 0 }),
          }}
        >
          Não encontrou o que procura?
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.55)",
            maxWidth: 440,
            margin: "20px auto 0",
            lineHeight: 1.7,
            ...(ctaVisible ? anim("hq-rise-sm", 800, 500) : { opacity: 0 }),
          }}
        >
          Criamos a partir de uma conversa. Cada detalhe, do seu jeito.
        </p>

        <a
          href={WA_CUSTOM}
          target="_blank"
          rel="noopener"
          className="mt-10 inline-block"
          style={{
            backgroundColor: "var(--hq-gold)",
            color: "#ffffff",
            padding: "18px 52px",
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            transition: "filter 250ms ease, transform 250ms ease",
            ...(ctaVisible ? anim("hq-rise-sm", 700, 650) : { opacity: 0 }),
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.12)";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.filter = "";
            (e.currentTarget as HTMLAnchorElement).style.transform = "";
          }}
        >
          Falar no WhatsApp
        </a>
      </section>

      {/* ── Footer ── */}
      <footer
        className="flex flex-col items-center gap-3 text-center"
        style={{
          backgroundColor: "var(--hq-white)",
          borderTop: "3px solid var(--hq-navy)",
          padding: "36px 24px",
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--hq-muted)",
        }}
      >
        <img src={ICON} alt="" style={{ height: 32, width: 32, objectFit: "contain", opacity: 0.55 }} />
        Haquímia · Joalheria artesanal
      </footer>
    </div>
  );
}
