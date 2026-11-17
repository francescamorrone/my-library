// Mini-libreria — Settimana VII Giorno I
//
// Devi fare 4 cose:
// 1. Definire una classe Libro (titolo, autore, anno, letto)
// 2. Definire una classe LibroDigitale che estende Libro (aggiunge formato, dimensioneMb)-
// 3. Aggiungere un listener al form che crea una nuova istanza e la aggiunge all'array
// 4. Renderizzare la lista nel <ul id="lista-libri"> via innerHTML
//
// Bonus: bottone "Segna come letto" su ogni elemento, gestito con event delegation.

class Libro {
  letto = false; // campo pubblico con valore di default (ES2022)

  constructor(titolo, autore, anno) {
    // id univoco anche dopo un reload (servirà domani con localStorage).
    // crypto.randomUUID() richiede HTTPS o localhost: apri la pagina con Live Server.
    this.id = crypto.randomUUID();
    this.titolo = titolo;
    this.autore = autore;
    this.anno = anno;
  }

  segnaComeLetto() {
    this.letto = true;
  }

  formato() {
    return "cartaceo";
  }

  // Factory: crea un Libro da una stringa "titolo|autore|anno" (EXTRA, passo 17)
  static daStringa(s) {
    const [titolo, autore, anno] = s.split("|");
    return new Libro(titolo, autore, Number(anno));
  }
}

class LibroDigitale extends Libro {
  constructor(titolo, autore, anno, dimensioneMb) {
    super(titolo, autore, anno); // prima di usare this
    this.dimensioneMb = dimensioneMb;
  }

  // Override: stesso nome del metodo del parent, vince questo
  formato() {
    return `digitale (${this.dimensioneMb} MB)`;
  }
}


// === Stato ===

let libri = []; // let: l'EXTRA "Rimuovi" riassegna l'array con filter


// === Render ===

// Crea un elemento con una classe e un testo (textContent: niente HTML interpretato)
function crea(tag, classe, testo) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (testo !== undefined) el.textContent = testo;
  return el;
}

function creaBottone(azione, testo) {
  const b = crea("button", "", testo);
  b.type = "button";
  b.dataset.azione = azione;
  return b;
}

function renderLibri() {
  const righe = libri.map((l) => {
    const li = crea("li", l.letto ? "letto" : "");
    li.dataset.id = l.id; // serve all'event delegation per ritrovare il libro

    const info = crea("div", "info");
    info.append(
      crea("span", "titolo", l.titolo),
      crea("span", "badge-formato", l.formato()),
      crea("div", "meta", `${l.autore} — ${l.anno}`),
    );

    const azioni = crea("div", "azioni");
    azioni.append(
      l.letto ? crea("span", "", "✓ letto") : creaBottone("leggi", "Segna come letto"),
      creaBottone("rimuovi", "Rimuovi"),
    );

    li.append(info, azioni);
    return li;
  });

  const lista = document.getElementById("lista-libri");
  if (righe.length === 0) {
    lista.replaceChildren(crea("li", "vuota", "Nessun libro in catalogo."));
  } else {
    lista.replaceChildren(...righe);
  }
  document.getElementById("contatore").textContent = libri.length;
}


// === Eventi ===

// Mostra/nasconde il campo "dimensione" in base al formato selezionato
document.getElementById("formato").addEventListener("change", (e) => {
  document.getElementById("campo-dimensione").hidden = e.target.value !== "digitale";
});

// Submit del form: legge tutti i campi con FormData e crea l'istanza giusta
document.getElementById("aggiungi-libro").addEventListener("submit", (e) => {
  e.preventDefault();

  const { titolo, autore, anno, formato, dimensione } =
    Object.fromEntries(new FormData(e.target));

  const nuovo = formato === "digitale"
    ? new LibroDigitale(titolo, autore, Number(anno), Number(dimensione) || 0)
    : new Libro(titolo, autore, Number(anno));

  libri.push(nuovo);
  renderLibri();
  e.target.reset();
  document.getElementById("campo-dimensione").hidden = true;
});

// Event delegation: un solo listener per tutti i bottoni della lista
document.getElementById("lista-libri").addEventListener("click", (e) => {
  const bottone = e.target.closest("[data-azione]");
  if (!bottone) return;

  const id = bottone.closest("li").dataset.id; // stringa (UUID): niente parseInt

  if (bottone.dataset.azione === "leggi") {
    libri.find((l) => l.id === id)?.segnaComeLetto();
  } else if (bottone.dataset.azione === "rimuovi") {
    libri = libri.filter((l) => l.id !== id);
  }

  renderLibri();
});


// === Avvio ===
renderLibri();
console.log(Libro.daStringa("1984|Orwell|1949")); // verifica EXTRA 17
