// Mini-libreria — Settimana VII Giorno I
//
// Devi fare 4 cose:
// 1. Definire una classe Libro (titolo, autore, anno, letto)
// 2. Definire una classe LibroDigitale che estende Libro (aggiunge formato, dimensioneMb)-
// 3. Aggiungere un listener al form che crea una nuova istanza e la aggiunge all'array
// 4. Renderizzare la lista nel <ul id="lista-libri"> via innerHTML
//
// Bonus: bottone "Segna come letto" su ogni elemento, gestito con event delegation.


// === Classi ===

class Libro {
    constructor(_title, _author, _year, _read) {
        this.title = _title;
        this.author = _author;
        this.year = _year;
        this.read = _read;
    }
}

class LibroDigitale extends Libro {
    constructor(_title, _author, _year, _read, _format, _mb) {
        super(_title, _author, _year, _read);
        this.format = _format;
        this.mb = _mb;
    }
}



// === Stato (array di libri) ===



// === Render ===



// === Eventi ===
