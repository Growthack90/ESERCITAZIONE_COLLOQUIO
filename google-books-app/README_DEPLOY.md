# Deploy su GitHub Pages con GitHub Actions

Le due versioni dell'app (SPA statiche Vite) vengono pubblicate insieme tramite il workflow [.github/workflows/deploy.yml](../.github/workflows/deploy.yml):

- Pagina iniziale: `https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/`
- Senza Redux: `https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/no-redux/`
- Con Redux e RTK Query: `https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/redux/`

## Come funziona

Il deploy parte quando viene pubblicato il tag `v2.0-redux-rtk-query` oppure manualmente da **Actions → Deploy versions to GitHub Pages → Run workflow**. Il workflow:

1. compila il tag `v1.0-senza-redux` in `no-redux/` e il tag `v2.0-redux-rtk-query` in `redux/`, impostando il `base` Vite corretto per ciascun percorso;
2. aggiunge una pagina iniziale con i link alle due versioni;
3. pubblica l'intero sito su GitHub Pages.

Per pubblicare una nuova versione in futuro, aggiorna i riferimenti ai tag nel workflow e il trigger del deploy, poi crea e pubblica il nuovo tag.

In [vite.config.ts](./vite.config.ts) il `base` predefinito è `/ESERCITAZIONE_COLLOQUIO/`; il workflow lo sovrascrive durante le build di pubblicazione. Se rinomini il repository, aggiorna i percorsi sia nel workflow sia in `../pages/index.html`.

Per la configurazione iniziale di Pages, l'autorizzazione del tag nell'environment `github-pages` e i passaggi per rilanciare il deploy, consulta la [guida principale](../README.md).

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
- **Il workflow non pubblica**: verifica che la sorgente di Pages sia **GitHub Actions**, che entrambi i tag configurati esistano e che il tag del trigger sia stato pubblicato.
- Dopo aver cambiato il secret, rilancia il workflow: la chiave è letta solo al momento del build.
