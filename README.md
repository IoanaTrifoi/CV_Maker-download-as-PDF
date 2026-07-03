# CV Maker PDF

Editor vizual de CV cu export PDF, rulat local pe Windows. Fara dependente externe — doar Node.js.

---

## Pornire rapida

**Dublu-click pe `START.bat`**

Sau din terminal:

```
node server.js
```

Aplicatia se deschide automat la `http://localhost:3847`

**Cerinte:**
- [Node.js](https://nodejs.org) (v18 sau mai nou)
- Google Chrome **sau** Microsoft Edge (necesar pentru generarea PDF)

---

## Ce face

- Editor vizual tip „drag & drop" pentru CV-uri
- 8 sabloane predefinite cu design diferit
- Export PDF direct din browser (via Chrome headless)
- Salvare automata a continutului in `data/cv-blocks.json`
- Upload poze (foto profil sau imagini in CV)
- Undo / Redo nelimitat
- Paleta de culori rapida (bara de jos)

---

## Structura proiect

```
CV_Maker_PDF/
├── server.js              # Server HTTP Node.js (port 3847)
├── START.bat              # Pornire cu dublu-click (Windows)
├── package.json
│
├── public/                # Interfata aplicatiei
│   ├── index.html         # Pagina principala (editor)
│   ├── css/
│   │   └── editor.css     # Stiluri editor (tema dark)
│   └── js/
│       ├── blocks.js      # Logica blocurilor CV + render PDF
│       └── editor.js      # Editor interactiv (canvas, props, toolbox)
│
├── data/
│   ├── cv-blocks.json     # Continutul CV-ului salvat
│   └── templates/
│       ├── index.json     # Lista sabloane (id, nume, culori)
│       ├── 1.json         # Sidebar Bej
│       ├── 2.json         # Minimal Intunecat
│       ├── 3.json         # Navy si Auriu
│       ├── 4.json         # Corporate Albastru
│       ├── 5.json         # Modern Galben
│       ├── 6.json         # Monocrom Elegant
│       ├── 7.json         # Soft Bej
│       └── 8.json         # Creativ Colorat
│
├── uploads/               # Poze incarcate din editor
├── output/                # Fisierele generate
│   ├── *.html             # CV exportat ca HTML
│   └── *.pdf              # CV exportat ca PDF
│
└── CV-EXEMPLE/            # Exemple PDF de referinta
```

---

## Sabloane disponibile

| # | Nume | Design |
|---|------|--------|
| 1 | Sidebar Bej | Coloana laterala stanga, ton cald bej/maro |
| 2 | Minimal Intunecat | O coloana, titluri gri, font Montserrat |
| 3 | Navy si Auriu | Sidebar navy, accente aurii, font Poppins |
| 4 | Corporate Albastru | Titluri albastre, aspect formal profesional |
| 5 | Modern Galben | Accente amber/galben, font Oswald condensat |
| 6 | Monocrom Elegant | Alb-negru, serif Playfair Display, minimalist |
| 7 | Soft Bej | Sidebar cald prafuit, font Raleway |
| 8 | Creativ Colorat | 2 coloane, accent turcoaz, font Poppins |

Sabloanele se aplica din meniul **Sabloane** din bara de sus. Continutul existent se pastreaza daca structura blocurilor e compatibila.

---

## Tipuri de blocuri

**Structura**
- `Antet` — Nume, titlu profesional, foto, contacte
- `Sectiune` — Bloc cu titlu + icon + continut copii
- `Grid / Container` — Impartire pe coloane (2 col, 3 col, sidebar, matrice personalizata)

**CV**
- `Experienta` — Perioada + titlu + lista de activitati (timeline)
- `Skill` — Eticheta: valoare pe acelasi rand
- `Progres` — Bara de progres cu nivel procentual
- `Cerc %` — Cerc SVG cu procent
- `Dots` — Puncte de nivel (1–5 / 1–10)
- `Link` — Link catre portofoliu / GitHub / site

**Text**
- `Text` — Paragraf liber
- `Titlu` — Heading evidentiat
- `Citat` — Text in stil motto/citat
- `Highlight` — Caseta text colorata
- `Nota` — Callout / notita importanta
- `Coloane` — Doua coloane de text

**Decor**
- `Imagine` — Imagine incarcata de pe PC
- `Emoji` — Emoji + text pe acelasi rand
- `Badge` — Eticheta rotunjita colorata
- `Icon` — Pictograma FontAwesome + text
- `Forma` — Dreptunghi sau cerc decorativ
- `Linie` — Separator orizontal
- `Spatiu` — Spatiu vertical gol

---

## Utilizare editor

### Adaugare blocuri
Click pe un instrument din bara de sus (toolbox), apoi click pe canvas. Daca un `Sectiune` sau `Container` e selectat (bordura albastra), blocul nou se insereaza direct in el.

### Grid personalizat (matrice)
1. Selecteaza o Sectiune sau Container
2. In panoul Proprietati (dreapta) → **Tip grid** → alege **Matrice personalizata**
3. Seteaza numarul de coloane si randuri
4. Click **Genereaza**

### Culori rapide
Bara de jos contine paleta de culori. Selecteaza un bloc → click o culoare → se aplica pe text sau fundal.

### Salvare si PDF
- **Ctrl+S** sau butonul **Salvează** — salveaza in `data/cv-blocks.json`
- **Butonul PDF** — genereaza `output/*.pdf` via Chrome headless si il deschide

### Undo / Redo
**Ctrl+Z** / **Ctrl+Y** — sau butoanele din toolbox / meniul Editare.

---

## API intern (server.js)

| Metoda | Ruta | Functie |
|--------|------|---------|
| GET | `/api/blocks` | Incarca continutul CV |
| POST | `/api/blocks` | Salveaza continutul CV |
| GET | `/api/templates` | Lista sabloane |
| GET | `/api/templates/:id` | Incarca un sablon |
| POST | `/api/upload` | Upload imagine |
| POST | `/api/generate-pdf` | Genereaza PDF |
| GET | `/api/open-pdf` | Deschide PDF in browser |

---

## Personalizare sablon

Fiecare sablon este un fisier JSON in `data/templates/`. Structura:

```json
{
  "id": "1",
  "name": "Numele sablonului",
  "description": "Descriere scurta",
  "colors": ["#culoare1", "#culoare2", "#culoare3"],
  "blocks": [ ... ]
}
```

`blocks` urmeaza exact acelasi format ca `data/cv-blocks.json`. Poti exporta CV-ul curent si salva ca sablon nou.

---

## Fonturi disponibile

Poppins, Montserrat, Playfair Display, Oswald, Raleway, Bebas Neue, Dancing Script, Pacifico, Lobster, Comic Neue, Abril Fatface (toate via Google Fonts, incarcate online).

---

## Limitari cunoscute

- PDF-ul necesita Chrome sau Edge instalat pe sistem
- Fonturile Google Fonts necesita conexiune la internet la prima incarcare
- Fisierul PDF se suprascriere la fiecare generare (nu se creeaza versiuni)
- Imaginile incarcate se salveaza local in `uploads/` si nu se includ in PDF daca lipsesc

---

## Licentiere

Proiect intern. Codul este proprietatea utilizatorului.
