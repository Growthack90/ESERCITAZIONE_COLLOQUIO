# Google Books App

Applicazione web realizzata con React, TypeScript e Vite. Il progetto contiene le istruzioni per un esercizio in cui si richiede una ricerca di libri tramite Google Books API.

## Stato attuale

Al momento l'app mostra ancora la schermata iniziale del template React + Vite: loghi, collegamenti alla documentazione e un contatore incrementale. Il contatore è gestito nello stato React del componente principale.

Le funzionalità indicate nell'esercizio — ricerca dei libri, risultati della Google Books API, paginazione, scelta del numero di risultati e pagina di dettaglio — non sono ancora implementate. Di conseguenza, l'app attuale non effettua richieste alla API e non richiede una chiave Google Books.

## Dipendenze

È necessario avere installati **Node.js** e **npm**.

Le dipendenze dichiarate in `google-books-app/package.json` sono:

- **React** e **React DOM**: rendering dell'interfaccia e gestione dello stato.
- **Vite** e **@vitejs/plugin-react**: server di sviluppo e compilazione dell'app.
- **TypeScript**: tipizzazione e controllo del codice.
- **Bootstrap**: framework CSS, disponibile nel progetto ma non ancora usato nella schermata attuale.
- **Lucide React**: icone, disponibile nel progetto ma non ancora usato nella schermata attuale.
- **React Router DOM**: gestione delle route, disponibile nel progetto ma non ancora usato.
- **Oxlint**: controllo statico del codice.

`package-lock.json` blocca le versioni risolte delle dipendenze per installazioni riproducibili.

Per installare tutte le dipendenze (da eseguire nella cartella `google-books-app`):

```bash
npm install
```

In alternativa, per un'installazione identica al lockfile:

```bash
npm ci
```

### Come è stato creato il progetto

Il progetto è stato generato con il template React + TypeScript di Vite, poi sono state aggiunte le librerie extra:

```bash
npm create vite@latest google-books-app -- --template react-ts
cd google-books-app
npm install bootstrap react-router-dom lucide-react
```

Chi clona il repository non deve rieseguire questi comandi: basta `npm install`.

## Avvio in locale

Aprire un terminale nella cartella del progetto e lanciare:

```bash
cd google-books-app
npm install
npm run dev
```

Vite mostrerà nel terminale l'indirizzo locale da aprire nel browser. Per creare una build di produzione:

```bash
npm run build
```

Per visualizzare localmente la build:

```bash
npm run preview
```

Per eseguire Oxlint:

```bash
npm run lint
```

## Funzionamento tecnico

`src/main.tsx` crea la radice React nell'elemento `#root` di `index.html` e renderizza l'app in modalità `StrictMode`. `src/App.tsx` contiene il componente principale e il contatore; `src/index.css` e `src/App.css` definiscono gli stili. Vite gestisce lo sviluppo con aggiornamento rapido (HMR) e genera gli asset ottimizzati con `npm run build`.

## Funzionalità previste dall'esercizio

La consegna descrive una single-page application responsive che interroga l'endpoint Google Books `https://www.googleapis.com/books/v1/volumes?q={search_terms}`. La versione richiesta dovrebbe mostrare i libri trovati, riassumere le descrizioni nella lista, aggiornare i risultati mentre si digita, consentire di scegliere 5, 10, 15 o 20 risultati per pagina e navigare tra le pagine. Selezionando un libro dovrebbe aprirsi il dettaglio con le informazioni e l'eventuale link esterno; in assenza di copertina è previsto un segnaposto.

Queste indicazioni descrivono l'obiettivo dell'esercizio, non funzionalità già presenti nel codice.

---
