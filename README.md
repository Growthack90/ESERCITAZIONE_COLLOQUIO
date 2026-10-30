# Google Books su GitHub Pages

Il repository contiene due versioni dell'applicazione, pubblicate insieme su GitHub Pages:

- [Pagina iniziale](https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/)
- [Versione senza Redux](https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/no-redux/)
- [Versione con Redux e RTK Query](https://growthack90.github.io/ESERCITAZIONE_COLLOQUIO/redux/)

## Configurazione iniziale su GitHub

Apri il repository su GitHub e completa questi passaggi. Sono necessari i permessi di amministratore del repository.

### 1. Scegli GitHub Actions come sorgente di Pages

1. Vai in **Settings → Pages**.
2. In **Build and deployment → Source**, seleziona **GitHub Actions**.

### 2. Autorizza il tag a usare l'environment di deploy

Il job finale pubblica il sito usando l'environment `github-pages`. GitHub deve autorizzare il tag che avvia il deploy, altrimenti il job `deploy` viene bloccato anche se le build sono riuscite.

1. Vai in **Settings → Environments** e apri l'environment **github-pages**. Se non esiste, crealo con questo nome.
2. Nella sezione **Deployment branches and tags**, seleziona **Selected branches and tags**.
3. Aggiungi il tag esatto `v2.0-redux-rtk-query` tra i riferimenti autorizzati e salva. Se l'interfaccia propone un pattern, inserisci `v2.0-redux-rtk-query` (oppure `v*` per autorizzare anche i futuri tag di versione).

Per correggere l'attuale deploy bloccato, dopo aver salvato l'environment:

1. Apri **Actions → Deploy versions to GitHub Pages**.
2. Seleziona l'esecuzione più recente relativa al tag `v2.0-redux-rtk-query`.
3. Premi **Re-run jobs → Re-run all jobs**. Eseguire tutti i job ricrea anche l'artefatto con entrambe le versioni.
4. Attendi che i job `build` e `deploy` risultino entrambi **Success**.

### 3. Configura la chiave Google Books (consigliato)

1. In Google Cloud Console, crea o scegli un progetto e abilita **Books API**.
2. Crea una chiave API.
3. Vai in **Settings → Secrets and variables → Actions → New repository secret**.
4. Crea il secret `VITE_GOOGLE_BOOKS_API_KEY` e incolla il valore della chiave. Non inserirlo nei file del repository o in questo README.

Senza la chiave l'app può comunque compilarsi, ma le richieste potrebbero esaurire la quota pubblica. La chiave viene incorporata nel JavaScript pubblico dell'app: limita la chiave ai referrer `https://growthack90.github.io/*` e alla sola **Books API**.

## Pubblicazione delle due versioni

Il workflow è definito in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Usa due tag Git:

- `v1.0-senza-redux` per compilare la versione senza Redux in `/no-redux/`;
- `v2.0-redux-rtk-query` per compilare la versione Redux in `/redux/` e avviare il deploy.

Il deploy del tag `v2.0-redux-rtk-query` è già stato avviato. Dopo aver autorizzato il tag nell'environment, usa **Re-run all jobs** come descritto sopra. In futuro, per pubblicare un'altra versione Redux:

1. Aggiorna in `.github/workflows/deploy.yml` il tag del trigger e il riferimento `ref` della versione Redux.
2. Registra e pubblica il nuovo tag sul commit che contiene il workflow aggiornato.
3. Se l'environment `github-pages` usa una lista di tag selezionati, autorizza anche il nuovo tag.
4. Verifica l'esito in **Actions** e poi apri gli URL di Pages.

Per avviare manualmente il workflow, vai in **Actions → Deploy versions to GitHub Pages → Run workflow** e seleziona il branch che contiene il workflow aggiornato. L'esecuzione manuale usa comunque i tag configurati nel workflow.

## Verifica e problemi comuni

- **Build riuscita, deploy fallito con “Tag … is not allowed to deploy to github-pages”**: autorizza il tag nell'environment `github-pages` e rilancia **tutti** i job.
- **Un URL restituisce 404 dopo un deploy riuscito**: verifica che Pages usi **GitHub Actions**, che il job di deploy sia **Success** e riprova dopo qualche minuto.
- **Pagina vuota o risorse 404**: controlla i percorsi `--base` nel workflow. Devono terminare rispettivamente con `/no-redux/` e `/redux/`.
- **Errore di quota Google Books**: verifica il secret e le restrizioni della chiave; dopo aver modificato il secret, rilancia il workflow perché viene letto durante la build.

Per i dettagli sullo sviluppo locale e sulla chiave API, consulta [`google-books-app/README_DEPLOY.md`](google-books-app/README_DEPLOY.md).
