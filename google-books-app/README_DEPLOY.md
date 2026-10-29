# Deploy su GitHub Pages con GitHub Actions

L'app (cartella `google-books-app`) è una SPA statica Vite. Viene pubblicata automaticamente su GitHub Pages tramite il workflow [.github/workflows/deploy.yml](./.github/workflows/deploy.yml).

URL finale: `https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/`

## Come funziona

A ogni push su `main` (o avviandolo a mano da **Actions → Deploy to GitHub Pages → Run workflow**) il workflow:

1. **build**: installa Node 22, esegue `npm ci` e `npm run build` dentro `google-books-app`, passando la chiave API come variabile `VITE_GOOGLE_BOOKS_API_KEY`, e carica la cartella `dist` come artefatto.
2. **deploy**: pubblica l'artefatto su GitHub Pages.

In [google-books-app/vite.config.ts](./google-books-app/vite.config.ts) è impostato `base: '/ESERCITAZIONE_COLLOQUIO/'`, necessario perché Pages serve il sito in una sottocartella con il nome del repository. In locale, `npm run dev` risponde quindi su `http://localhost:5173/ESERCITAZIONE_COLLOQUIO/`. Se rinomini il repository, aggiorna questo valore.

## Configurazione su GitHub (una tantum)

1. **Settings → Pages → Build and deployment → Source**: scegli **GitHub Actions**.
2. **Settings → Secrets and variables → Actions → New repository secret**:
   - Nome: `VITE_GOOGLE_BOOKS_API_KEY`
   - Valore: la tua chiave Google Books API.
3. Fai commit e push su `main`: il deploy parte da solo. Lo stato è visibile nella scheda **Actions**.

## Chiave API Google Books

Senza chiave la quota giornaliera condivisa è spesso esaurita (errore 429). Per crearne una:

1. Apri Google Cloud Console, crea o scegli un progetto e abilita **Books API**.
2. In **Credenziali** crea una **chiave API**.
3. In locale copia `google-books-app/.env.example` in `google-books-app/.env` e incolla la chiave; poi riavvia `npm run dev`. Il file `.env` deve stare nella radice di `google-books-app`, non in `src`, ed è ignorato da git.

## Sicurezza

La chiave viene incorporata nel JavaScript pubblicato, quindi è visibile a chiunque. Limitala nelle restrizioni della chiave:

- **Restrizione applicazione**: siti web, referrer `https://growthack90.github.io/*`
- **Restrizione API**: solo Books API

## Risoluzione problemi

- **Pagina bianca o file 404**: controlla che `base` in `vite.config.ts` coincida con il nome del repository.
- **Errore "Quota API esaurita"**: la chiave non è configurata o il secret ha un nome diverso da `VITE_GOOGLE_BOOKS_API_KEY`.
- **Il workflow non pubblica**: verifica che la sorgente di Pages sia **GitHub Actions** e che il push sia su `main`.
- Dopo aver cambiato il secret, rilancia il workflow: la chiave è letta solo al momento del build.
