import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import LOGO from "@/assets/logo-remove.png";

export const Route = createFileRoute("/intro")({
  head: () => ({
    meta: [{ title: "Haquímia" }],
  }),
  component: Intro,
});

function Intro() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  /* Sequence: fade in (1.2s) → hold (1.8s) → fade out (800ms) → navigate */
  useEffect(() => {
    const hold = setTimeout(() => setPhase("hold"), 1200);
    const out  = setTimeout(() => setPhase("out"),  3000);
    const go   = setTimeout(() => navigate({ to: "/" }), 3900);
    return () => { clearTimeout(hold); clearTimeout(out); clearTimeout(go); };
  }, [navigate]);

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "var(--hq-navy)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    opacity: phase === "out" ? 0 : 1,
    transition: phase === "out" ? "opacity 800ms cubic-bezier(0.4,0,1,1)" : "none",
    cursor: "pointer",
  };

  const logoStyle: React.CSSProperties = {
    width: 280,
    height: 280,
    objectFit: "contain",
    opacity: phase === "in" ? 0 : 1,
    transform: phase === "in" ? "translateY(20px) scale(0.97)" : "translateY(0) scale(1)",
    transition: "opacity 1100ms cubic-bezier(0.16,1,0.3,1), transform 1100ms cubic-bezier(0.16,1,0.3,1)",
  };

  const taglineStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontWeight: 300,
    fontSize: "0.55rem",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(184,144,42,0.7)",
    marginTop: 8,
    opacity: phase === "in" ? 0 : 1,
    transition: "opacity 900ms cubic-bezier(0.16,1,0.3,1) 400ms",
  };

  const lineStyle: React.CSSProperties = {
    width: phase === "in" ? 0 : 40,
    height: 1,
    backgroundColor: "var(--hq-gold)",
    opacity: 0.4,
    marginTop: 28,
    transition: "width 800ms cubic-bezier(0.16,1,0.3,1) 600ms",
  };

  return (
    <div style={containerStyle} onClick={() => navigate({ to: "/" })}>
      <img src={LOGO} alt="Haquímia" style={logoStyle} />
      <p style={taglineStyle}>Joalheria artesanal brasileira</p>
      <div style={lineStyle} />
    </div>
  );
}
