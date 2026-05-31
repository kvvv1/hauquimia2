import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";

export function ProductItem({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delay = (index % 3) * 100;

  return (
    <article
      ref={ref}
      className="group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <a href={product.wa} target="_blank" rel="noopener" className="block">
        {/* Image container with overlay */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "1 / 1", backgroundColor: "var(--hq-fallback)" }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ color: "var(--hq-muted)", fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              Em breve
            </div>
          )}
          {/* Navy gradient overlay */}
          <div className="hq-product-overlay" />
          {/* "Personalizar" label that appears on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 flex justify-center pb-5 opacity-0 translate-y-2 transition-all duration-400 ease-out group-hover:opacity-100 group-hover:translate-y-0"
            style={{ transitionDuration: "350ms" }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              Personalizar →
            </span>
          </div>
        </div>

        {/* Gold underline draws in on hover */}
        <div className="hq-product-line" />
      </a>

      <div style={{ paddingTop: 18, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "1.2rem",
              color: "var(--hq-dark)",
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.7rem",
              color: "var(--hq-muted)",
              marginTop: 6,
            }}
          >
            {product.material}
          </p>
        </div>

        {/* WhatsApp button — subtle, appears on hover on desktop, always visible on mobile */}
        <a
          href={product.wa}
          target="_blank"
          rel="noopener"
          title="Encomendar no WhatsApp"
          className="md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0"
          style={{
            flexShrink: 0,
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            border: "1px solid var(--hq-gold)",
            color: "var(--hq-gold)",
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background-color 250ms ease, color 250ms ease, opacity 300ms ease, transform 300ms ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.backgroundColor = "var(--hq-gold)";
            el.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.backgroundColor = "";
            el.style.color = "var(--hq-gold)";
          }}
        >
          {/* WhatsApp icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Encomendar
        </a>
      </div>
    </article>
  );
}
