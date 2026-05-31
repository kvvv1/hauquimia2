import brincoInicial from "@/assets/brinco-inicial.png";
import brincoLetra from "@/assets/brinco-letra.png";
import brincoPedra from "@/assets/brinco-pedra.png";
import colarCoracao from "@/assets/colar-coracao.png";
import colarNome from "@/assets/colar-nome.png";
import colarLetras from "@/assets/colar-letras.png";
import colarMedalha from "@/assets/colar-medalha.png";
import colarPombinha from "@/assets/colar-pombinha.png";
import pulseiraPombinha from "@/assets/pulseira-pombinha.png";
import pulseiraNome from "@/assets/pulseira-nome.png";

export type Category = "brincos" | "colares" | "pulseiras";

export interface Product {
  id: string;
  name: string;
  material: string;
  category: Category;
  image: string | null;
  wa: string;
}

const WA = "https://wa.me/553190621354?text=";

export const products: Product[] = [
  {
    id: "01",
    name: "Brinco Inicial",
    material: "Prata 925 · Banho ouro amarelo",
    category: "brincos",
    image: brincoInicial,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Brinco Inicial da Haquímia."),
  },
  {
    id: "02",
    name: "Brinco Palito",
    material: "Prata 925 · Banho ouro amarelo",
    category: "brincos",
    image: null,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Brinco Palito da Haquímia."),
  },
  {
    id: "03",
    name: "Brinco com Pedra",
    material: "Prata 925 · Banho ouro · Pedra natural",
    category: "brincos",
    image: brincoPedra,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Brinco com Pedra da Haquímia."),
  },
  {
    id: "04",
    name: "Brinco Letra",
    material: "Prata 925 · Banho ouro amarelo",
    category: "brincos",
    image: brincoLetra,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Brinco Letra da Haquímia."),
  },
  {
    id: "05",
    name: "Colar Coração",
    material: "Prata 925 · Banho ouro amarelo",
    category: "colares",
    image: colarCoracao,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Colar Coração da Haquímia."),
  },
  {
    id: "06",
    name: "Colar Nome",
    material: "Prata 925 · Banho ouro amarelo · Nome personalizado",
    category: "colares",
    image: colarNome,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Colar Nome da Haquímia."),
  },
  {
    id: "07",
    name: "Colar Letras",
    material: "Prata 925 · Ródio branco",
    category: "colares",
    image: colarLetras,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Colar Letras da Haquímia."),
  },
  {
    id: "08",
    name: "Colar Medalha",
    material: "Prata 925 · Banho ouro amarelo",
    category: "colares",
    image: colarMedalha,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Colar Medalha da Haquímia."),
  },
  {
    id: "09",
    name: "Colar Pombinha",
    material: "Prata 925 · Banho ouro amarelo",
    category: "colares",
    image: colarPombinha,
    wa: WA + encodeURIComponent("Olá! Tenho interesse no Colar Pombinha da Haquímia."),
  },
  {
    id: "10",
    name: "Pulseira Pombinha",
    material: "Prata 925 · Banho ouro amarelo",
    category: "pulseiras",
    image: pulseiraPombinha,
    wa: WA + encodeURIComponent("Olá! Tenho interesse na Pulseira Pombinha da Haquímia."),
  },
  {
    id: "11",
    name: "Pulseira Nome",
    material: "Prata 925 · Banho ouro amarelo · Nome personalizado",
    category: "pulseiras",
    image: pulseiraNome,
    wa: WA + encodeURIComponent("Olá! Tenho interesse na Pulseira Nome da Haquímia."),
  },
];

export const categories: { id: Category; label: string; title: string }[] = [
  { id: "brincos", label: "Brincos", title: "Brincos" },
  { id: "colares", label: "Colares", title: "Colares" },
  { id: "pulseiras", label: "Pulseiras", title: "Pulseiras" },
];
