import distribuire from "@/assets/ajutor-familii-glodeni-distribuire.jpg";
import oameni from "@/assets/ajutor-familii-glodeni-oameni.jpg";
import voluntari from "@/assets/ajutor-familii-glodeni-voluntari.jpg";
import alimente from "@/assets/ajutor-familii-glodeni-alimente.jpg";
import intalnire from "@/assets/ajutor-familii-glodeni-intalnire.jpg";
import biserica from "@/assets/ajutor-familii-glodeni-biserica.jpg";
import comunitate from "@/assets/ajutor-familii-glodeni-comunitate.jpg";
import rugaciune from "@/assets/ajutor-familii-glodeni-rugaciune.jpg";

export type Post = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  img?: string;
  gallery?: { src: string; alt: string }[];
  body: string[];
  source?: string;
};

export const posts: Post[] = [
  {
    slug: "ajutorarea-familiilor-nevoiase-din-glodeni",
    date: "12 noiembrie 2026",
    title: "Ajutorarea familiilor nevoiașe din Glodeni",
    excerpt: "Familiile nevoiașe din Glodeni au primit cartofi, ceapă și morcovi, cu sprijinul voluntarilor bisericii.",
    img: distribuire,
    gallery: [
      { src: oameni, alt: "Oameni așteaptă distribuirea alimentelor în curtea bisericii din Glodeni" },
      { src: voluntari, alt: "Voluntari descarcă saci cu legume din camion" },
      { src: alimente, alt: "Saci cu cartofi și ceapă pregătiți pentru familiile nevoiașe" },
      { src: intalnire, alt: "Participanți la întâlnirea din Biserica Sfânta Treime din Glodeni" },
      { src: biserica, alt: "Cuvânt adresat celor prezenți în sala bisericii" },
      { src: comunitate, alt: "Comunitatea adunată în sala bisericii din Glodeni" },
      { src: rugaciune, alt: "Cei prezenți în picioare în timpul întâlnirii de la biserică" },
    ],
    body: [
      "La Biserica Penticostală Sfânta Treime din Glodeni, oamenii s-au întrunit pentru un timp de cuvânt și rugăciune. Apoi, în curtea bisericii, voluntarii au împărțit alimente familiilor nevoiașe.",
      "Au fost oferite saci cu cartofi, ceapă și morcovi. Mulțumim lui Dumnezeu și tuturor celor care s-au implicat pentru ca acest ajutor să ajungă la oamenii care au nevoie de el.",
    ],
  },
  {
    slug: "o-paine-pe-zi-aduce-oamenii-la-isus",
    date: "27 martie 2017",
    title: "Proiectul „O pâine pe zi” aduce oamenii la Isus Hristos",
    excerpt: "Pâinea dăruită zilnic deschide inimile oamenilor către Evanghelie.",
    body: [
      "Prin proiectul „O pâine pe zi”, oamenii nevoiași din Glodeni primesc nu doar hrana de care au nevoie, ci și dragostea și grija bisericii.",
      "Pentru mulți dintre ei, acest gest simplu a devenit începutul unei relații cu Isus Hristos.",
    ],
    source: "https://igorlazar.wordpress.com/2017/03/27/proiectul-o-paine-pe-zi-aduce-oamenii-la-isus-hristos/",
  },
  {
    slug: "corul-de-copii",
    date: "24 aprilie 2013",
    title: "Corul de copii laudă pe Dumnezeu",
    excerpt: "Copiii din Glodeni înalță cântări de laudă.",
    img: "https://igorlazar.wordpress.com/wp-content/uploads/2013/04/dsc_1450.jpg?w=1200",
    body: ["Corul de copii al bisericii din Glodeni laudă pe Dumnezeu prin cântare, aducând bucurie întregii comunități."],
    source: "https://igorlazar.wordpress.com/2013/04/24/corul-de-copii-lauda-pe-dumnezeu/",
  },
  {
    slug: "finlandezi-in-glodeni-2013",
    date: "23 aprilie 2013",
    title: "Finlandezi în Glodeni (2013)",
    excerpt: "Vizita prietenilor din Finlanda la Glodeni.",
    body: ["În aprilie 2013, Glodeni a primit vizita unor prieteni din Finlanda, care au venit să cunoască lucrarea și oamenii de aici."],
    source: "https://igorlazar.wordpress.com/2013/04/23/finlandezi-in-glodeni-2013/",
  },
  {
    slug: "biserica-filadelfia-oradea",
    date: "22 decembrie 2009",
    title: "La Biserica Filadelfia din Oradea – 27 decembrie 2009",
    excerpt: "Duminică, 27 decembrie, la Oradea și Zalău.",
    img: "https://igorlazar.wordpress.com/wp-content/uploads/2009/12/filadelfia450.jpg",
    body: ["Duminică dimineață, 27 decembrie 2009, voi fi prezent la Biserica Penticostală Filadelfia din Oradea, iar după-masa la Biserica Penticostală Betel din Zalău."],
    source: "https://igorlazar.wordpress.com/2009/12/22/la-biserica-filadelfia-din-oradea-27-decembrie-2009/",
  },
  {
    slug: "sarutand-painea",
    date: "22 decembrie 2009",
    title: "Sărutând pâinea…",
    excerpt: "Un gest simplu care a mișcat o biserică întreagă.",
    body: [
      "Zilele acestea mă aflu, pentru cel puțin a 10-a oară în ultimii ani, în vizită în Oradea, pentru a împărtăși experiențe legate de proiectul „O pâine pe zi”.",
      "Duminica trecută, la o biserică din județul Bihor, în urma prezentării video, în care cineva săruta pâinea cea de toate zilele primită în dar, am avut ocazia să văd o reacție deosebită:",
      "Diaconul bisericii s-a ridicat în picioare și a spus: „Trebuie să mă pocăiesc, că timp de o viață nu am sărutat pâinea, considerând că e un fapt normal să ai pâine zilnic. Acești oameni nevoiași, lipsiți de pâinea cea de toate zilele, au știut să prețuiască pâinea ce li s-a oferit, sărutând-o.”",
      "Același diacon a precizat că acum înțelege mai bine gestul adunării celor 12 coșuri cu fărâmituri în urma înmulțirii pâinilor de către Isus.",
    ],
    source: "https://igorlazar.wordpress.com/2009/12/22/sarutand-painea/",
  },
  {
    slug: "proiectul-o-paine-pe-zi",
    date: "22 decembrie 2009",
    title: "Proiectul „O pâine pe zi”",
    excerpt: "Cum a început totul, în 2002.",
    body: [
      "Proiectul „O pâine pe zi” a început în 2002, la inițiativa pastorului Ilie Jolța – Biserica Penticostală Filadelfia, care a propus Bisericii Penticostale Sfânta Treime din Glodeni, Republica Moldova (30 de membri în prezent) să se implice în a oferi unor oameni săraci câte o pâine pe zi.",
      "Proiectul a căpătat amploare o dată cu achiziționarea, în anul 2005, de către biserică a cuptoarelor pentru producerea pâinii, unde lucrează 2 angajați, etapă care a fost posibilă cu ajutorul financiar din partea unor biserici evanghelice din Oradea și Zalău.",
    ],
    source: "https://igorlazar.wordpress.com/2009/12/22/proiectul-o-paine-pe-zi/",
  },
];
