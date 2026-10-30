# Promemoria: GitHub Actions e GitHub Pages

Questa guida riassume la configurazione e i passaggi fatti per compilare e pubblicare insieme le due versioni di Google Books. Il workflow si trova in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

## URL pubblicati

- Pagina iniziale: <https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/>
- Versione senza Redux: <https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/no-redux/>
- Versione con Redux e RTK Query: <https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/redux/>

## Cosa fa il workflow

Il workflow **Deploy versions to GitHub Pages** crea un unico sito statico contenente entrambe le versioni:

1. **Avvio**: parte quando viene pubblicato il tag `v2.0-redux-rtk-query`. Si può avviare anche manualmente da **Actions → Deploy versions to GitHub Pages → Run workflow**.
2. **Checkout**: scarica il commit puntato dal tag `v1.0-senza-redux` in `sources/no-redux` e quello puntato da `v2.0-redux-rtk-query` in `sources/redux`.
3. **Setup**: prepara Node.js 22.
4. **Build senza Redux**: esegue `npm ci`, `npx tsc -b` e compila Vite con base `/ESERCITAZIONE_COLLOQUIO/no-redux/`.
5. **Build Redux**: ripete i comandi sul tag Redux con base `/ESERCITAZIONE_COLLOQUIO/redux/`.
6. **Assemblaggio**: mette i due risultati nelle cartelle `site/no-redux/` e `site/redux/`; copia la pagina iniziale in `site/index.html`.
7. **Upload e deploy**: carica `site` come artefatto GitHub Pages e il job `deploy` lo pubblica nell'environment `github-pages`.

Le build sono separate: ciascuna usa codice e dipendenze del proprio tag. La variabile `VITE_GOOGLE_BOOKS_API_KEY` viene passata alle due build dal secret del repository.

## Configurazione GitHub necessaria

Questi passaggi richiedono permessi di amministratore del repository.

### GitHub Pages

1. Vai in **Settings → Pages**.
2. In **Build and deployment → Source**, seleziona **GitHub Actions**.

### Environment `github-pages`

Il job finale dichiara `environment: github-pages`. Se le regole di protezione non autorizzano il tag che ha avviato il workflow, le build possono riuscire ma GitHub rifiuta il deploy.

1. Vai in **Settings → Environments** e apri o crea l'environment `github-pages`.
2. In **Deployment branches and tags**, controlla le regole di deploy.
3. Se è selezionato **Selected branches and tags**, autorizza il tag esatto `v2.0-redux-rtk-query`. Per le versioni future, aggiorna questa regola oppure usa un pattern appropriato, ad esempio `v*`.
4. Se intendi avviare il workflow manualmente da un branch, autorizza anche quel branch (ad esempio `main`) nell'environment.

### Secret API

1. In **Settings → Secrets and variables → Actions**, crea un **New repository secret**.
2. Usa il nome esatto `VITE_GOOGLE_BOOKS_API_KEY` e come valore la chiave Google Books.
3. Limita la chiave in Google Cloud ai referrer `https://growthack90.github.io/*` e alla sola Books API.

La build riesce anche senza il secret, ma le chiamate possono dipendere dalla quota pubblica. Poiché Vite incorpora le variabili `VITE_*` nel JavaScript distribuito, la chiave sarà leggibile dagli utenti: le restrizioni lato Google sono importanti. Non salvare mai la chiave nei file versionati.

## Azione da completare per il deploy corrente

Il tag `v2.0-redux-rtk-query` è stato pubblicato. Il primo tentativo ha compilato entrambe le versioni e creato l'artefatto, ma il job `deploy` è stato respinto perché il tag non era autorizzato nell'environment `github-pages`.

Dopo aver aggiornato le regole dell'environment:

1. Apri **Actions → Deploy versions to GitHub Pages**.
2. Apri il run relativo a `v2.0-redux-rtk-query`.
3. Seleziona **Re-run jobs → Re-run all jobs**. Rilanciare tutti i job ricostruisce anche l'artefatto.
4. Verifica che sia `build` sia `deploy` terminino con **Success**.
5. Apri i tre URL elencati sopra. Se Pages restituisce ancora 404 subito dopo il successo, attendi qualche minuto e riprova.

## Pubblicare una versione successiva

Il workflow attuale usa riferimenti espliciti ai tag: il tag Redux compare sia nel trigger sia nel checkout, mentre quello senza Redux resta fissato a `v1.0-senza-redux`. Per rilasciare una nuova versione Redux:

1. Aggiorna il codice e verifica la build in locale.
2. Aggiorna in `.github/workflows/deploy.yml` il tag del trigger e il `ref` del checkout Redux.
3. Aggiorna l'environment `github-pages` per autorizzare il nuovo tag, se le regole selezionano i tag individualmente.
4. Crea e pubblica il nuovo tag sul commit che contiene il workflow aggiornato. Il push del tag avvia automaticamente il deploy.
5. Controlla i job in **Actions** e verifica gli URL.

Per aggiornare anche la versione senza Redux, crea il nuovo tag e modifica il relativo `ref` nel workflow. Evita di spostare o sovrascrivere tag già pubblicati: è più affidabile creare tag nuovi per ogni release.

L'avvio manuale **Run workflow** usa il workflow presente nel branch selezionato, ma i `ref` di checkout restano quelli scritti nel file: l'avvio manuale non sostituisce né aggiorna i tag delle due applicazioni.

## Come leggere un run e risolvere i problemi

In **Actions**, apri un'esecuzione per vedere lo stato dei singoli job e dei relativi step:

- Se fallisce **Build no-Redux** o **Build Redux**, controlla i log dello step `npm ci`, `tsc` o `vite build`.
- Se fallisce **Assemble Pages site**, verifica i percorsi dei checkout e che il file `pages/index.html` sia presente nel commit/tag Redux usato dal workflow.
- Se la build è riuscita ma il deploy riporta `Tag "... " is not allowed to deploy to github-pages`, correggi le regole dell'environment e rilancia **Re-run all jobs**.
- Se il deploy è **Success** ma un'app è bianca o le risorse restituiscono 404, verifica i `--base` del workflow: devono terminare con `/no-redux/` e `/redux/`.
- Se la pagina iniziale non compare, controlla che `pages/index.html` contenga i collegamenti ai percorsi corretti.
- Dopo aver cambiato il secret API, esegui una nuova build: il valore viene letto durante la compilazione.

## Impostazioni del workflow

- `permissions`: concede al workflow lettura del repository e permessi Pages necessari per la pubblicazione.
- `concurrency`: mantiene un solo deploy Pages in corso e annulla quello precedente se ne parte uno nuovo.
- `workflow_dispatch`: abilita l'avvio manuale dalla scheda **Actions**.
- `actions/upload-pages-artifact` e `actions/deploy-pages`: trasferiscono e pubblicano l'artefatto statico.

Se rinomini il repository, aggiorna anche i percorsi `--base` nel workflow e i link in [`pages/index.html`](../pages/index.html).

Per le istruzioni di sviluppo locale, consultare il [README dell'applicazione](README.md).
