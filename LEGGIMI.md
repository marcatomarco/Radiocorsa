# Radio Corsa — metterla online e usarla su iPad

Cartella pronta da pubblicare. Contiene:

```
index.html                 la app
sw.js                      service worker (funziona offline)
manifest.webmanifest       dati per l'icona sulla home
icon-180/192/512 + maskable  icone
```

---

## 1. Pubblicare con GitHub Pages (gratis, senza terminale)

1. Vai su **github.com → New repository**. Nome: `radiocorsa`. Visibilità: **Public**
   (Pages sui repo privati richiede un piano a pagamento). Crea.
2. Nella pagina del repo: **Add file → Upload files**. Trascina dentro **tutti i file
   di questa cartella** (index.html, sw.js, manifest.webmanifest e le 4 icone).
   Poi **Commit changes**.
3. **Settings → Pages**. In *Build and deployment*: Source = **Deploy from a branch**,
   Branch = **main**, cartella **/ (root)**. Salva.
4. Dopo 1–2 minuti in cima alla stessa pagina compare il link:
   `https://TUONOME.github.io/radiocorsa/`

Quel link è già **https**, quindi microfono e installazione sulla home funzionano.

### Aggiornare la app in futuro
Ricarichi `index.html` da *Add file → Upload files* (stesso nome, sovrascrive).
Se sull'iPad vedi ancora la vecchia versione: cambia `VERSION` in `sw.js`
(es. `radiocorsa-v4`) e ricarica anche quello — così la cache si rinnova.

---

## 2. Installarla sull'iPad

1. Apri il link **in Safari** (non in Chrome: su iOS solo Safari installa le web app per bene).
2. Tasto **Condividi** → **Aggiungi a Home**.
3. Apri l'app dall'icona. Al primo *Avvia ascolto* Safari chiede il microfono: **Consenti**.

> Se il microfono non parte quando la apri dall'icona, usala dal link in Safari:
> su alcune versioni di iPadOS la modalità "app" è più capricciosa con i permessi.

Da lì in poi funziona anche **senza rete**: start list, classifiche e riconoscimento dei
dorsali restano sull'iPad. Serve la rete solo per il riconoscimento vocale (entrambi i
motori lo elaborano su server).

---

## 3. I due motori di ascolto (tasto ⚙)

**Safari / Web Speech — gratis.** iOS chiude la sessione ogni poco (silenzio lungo,
cambio schermata, timeout interno). La app ora la ricuce da sola: riavvio a scaletta,
watchdog che taglia e ripristina se non arriva nulla per 25 secondi, ripresa quando
torni sull'app. Nella pratica ascolta all'infinito, ma ogni tanto perde una frazione
di secondo nel riaggancio.

**Cloud (Deepgram) — continuo davvero.** L'audio del microfono viene mandato a 16 kHz
su un WebSocket sempre aperto: nessun taglio, nessun timeout, e il riconoscimento di
numeri e cognomi in spagnolo è nettamente migliore (`numerals` restituisce già le cifre).

Per attivarlo:
1. Registrati su <https://console.deepgram.com> (crediti di prova gratuiti inclusi).
2. Crea una API key con permesso **usage:write** e copiala.
3. Nella app: ⚙ → incolla la chiave → **Salva**. Con motore *Automatico* la app passa
   al cloud da sola quando la chiave c'è, e ripiega su Safari se la chiave viene rifiutata.

La chiave resta solo nel browser dell'iPad (`localStorage`), non finisce su GitHub.
Attenzione: chi apre il link **non** vede la tua chiave, ma se metti la chiave dentro
il codice invece che nel campo ⚙ diventerebbe pubblica — non farlo.

**Costo indicativo Deepgram:** lo streaming Nova sta intorno a pochi centesimi di dollaro
per ora di ascolto; una tappa intera costa quanto un caffè. Controlla il listino aggiornato
sul loro sito, i prezzi cambiano.

---

## 4. Le altre cose aggiunte

- **Schermo sempre acceso** mentre ascolta (Wake Lock; su iPadOS vecchi ripiega su un
  video muto di un pixel). Si disattiva da ⚙.
- **Keep-alive audio**: un tono inudibile tiene viva la sessione audio di iOS, che
  altrimenti sospende tutto quando l'app va in secondo piano.
- **Livello microfono**: su iPad con motore Safari conviene tenerlo **spento** — il
  secondo accesso al microfono è una delle cause per cui il riconoscimento cade.
  È spento di default su iOS.
- **Cronometro** della sessione di ascolto e pallino di stato colorato accanto a
  "what it hears": verde = sta ascoltando, giallo = si sta riagganciando, rosso = problema.
- **Multilingua** nel menu lingua: funziona solo con il motore cloud.

---

## 5. Alternative all'hosting su GitHub

- **Cloudflare Pages** → *Create project → Direct upload*: trascini la cartella, link https
  immediato, dominio `*.pages.dev`.
- **Netlify** → *Add new site → Deploy manually*: stessa cosa, dominio `*.netlify.app`.

Entrambi gratis e vanno bene uguale: serve solo che il sito sia servito in https.
