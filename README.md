# A.S. Sarees – Banarasi saree shop website

Phone-first website for A.S. Sarees, Varanasi. Customers browse sarees by
fabric and order on WhatsApp. There is no backend: sarees, fabrics and shop
details come from a Google Sheet that the site reads every time it opens.

- **Stack:** React 18 + Vite, PapaParse (reads the sheet), plain CSS (same as Balaji Traders)
- **Hosting:** Cloudflare Pages (free `*.pages.dev` address)
- **Orders:** WhatsApp click-to-chat links with the order already typed
- **Sheet:** [A.S. Sarees Product Data](https://docs.google.com/spreadsheets/d/1kekePlcqmymoZdaXF8ajZm99yNO_Bx5FDVh2VzR_6sE/edit) — already set in `src/config.js`

## Pages

| Link | Page |
| --- | --- |
| `/#/` | Home: banner, shop by fabric, festive edit, new in the shop, how to order, video call, visit shop |
| `/#/fabric/<id>` | Shop by fabric: fabric chips, about the fabric, search, colour filter, sort |
| `/#/fabric/all?q=red` | Search results |
| `/#/saree/<code>` | Saree details: photos, colour choice, price → **Order on WhatsApp** / video call |

What every button does is drawn in the "User flow" board of the design.

## 1. Set up the Google Sheet (one time, 2 minutes)

1. Open the sheet → **File → Import → Upload** → choose
   `sheet-template/AS-Sarees-sheet-template.xlsx` → **Replace spreadsheet** → **Import data**.
   This adds the tabs `sarees`, `fabrics`, `settings` and `help`, and keeps the same sheet link.
2. **Share → General access → Anyone with the link → Viewer.** The website can only
   read the sheet when it is shared like this. Never put customer details,
   purchase costs or margins in this sheet: anyone with the link can read it.

The `help` tab explains every column. In short:

### Tab `sarees`: one row per saree

| column | what to write | example |
| --- | --- | --- |
| `code` | short unique code | `AS-KT-003` |
| `name` | name on the card | `Maroon Katan Silk with gold buta` |
| `fabric` | a name from the `fabrics` tab | `Katan Silk` |
| `colour` | main colour (used by colour filter) | `Maroon` |
| `price` | number only; empty = "Price on WhatsApp" | `8500` |
| `mrp` | optional, shown struck through | `9500` |
| `image`, `image2`, `image3` | file in `public/images/` or a full `https://` photo link | `katan-maroon.webp` |
| `colours` | optional other colours, comma separated | `Maroon, Royal blue` |
| `occasion`, `weave`, `zari`, `length`, `blouse`, `care` | optional details | `Wedding` |
| `note` | optional line under the price | `Silk Mark certified` |
| `new` | `yes` = show in "New in the shop" | `yes` |
| `show` | `no` hides the saree (sold out) | |
| `sort` | optional order, smaller first | `1` |

### Tab `fabrics`: one row per round fabric tile

`id`, `name`, `hindi`, `image`, `about`, `sort`, `show`. A saree whose fabric is
not in this tab still gets a fabric page automatically.

### Tab `settings`: `key` and `value`

| key | value |
| --- | --- |
| `shop_name` | `A.S. Sarees` |
| `tagline` | `विरासत जो पहनी जाये` |
| `whatsapp_number` | `917985309411` (country code + number, digits only) |
| `phone_number` | `+919389990548` |
| `address` | shop address |
| `hours` | e.g. `10 AM – 9 PM, Monday closed` |
| `maps_url` | your Google Maps share link (empty = the address is searched) |
| `gstin` | `09AWTPP1361N1ZP` |
| `announcement` | the red line at the very top |
| `video_call` | `yes` / `no` — shows or hides the video-call buttons |

**Keep the `value` column as Plain text** (Format → Number → Plain text). Google
reads a column as one type, so a number typed into a text column can come
through empty.

### How the site reads the sheet

`src/config.js` builds a CSV link for each tab from the sheet ID. If a tab is
missing or the sheet can't be reached, the site uses the sample files in
`public/data/` (and, on phones that visited before, the last saved copy), so it
never shows an empty page. Changes in the sheet show up on the site within a
minute or two — no new deploy needed.

Prefer "Publish to web" links instead? Publish each tab as CSV and put the links
in `.env` / Cloudflare as `VITE_SAREES_CSV_URL`, `VITE_FABRICS_CSV_URL`,
`VITE_SETTINGS_CSV_URL` (see `.env.example`).

## 2. Run it on your computer

```
npm install
npm run dev            # opens http://localhost:5173
```

## 3. Put it online for free (Cloudflare Pages)

**From GitHub (recommended, same as Balaji Traders)**

1. Push this folder to a new GitHub repository, e.g. `as-sarees`.
2. Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings: framework **Vite**, build command `npm run build`, output folder `dist`.
4. Project name becomes the address, e.g. `as-sarees.pages.dev`.

Every push to `main` updates the site. Saree and price changes in the sheet do
**not** need a new deploy.

**Without GitHub:** Cloudflare → Workers & Pages → Create → Pages →
**Upload assets** → upload the `dist` folder from this zip.

## Adding photos

- Easiest: put the photo in `public/images/` (WebP or JPG, about 800 px wide,
  upright 4:5 looks best) and write its file name in the sheet. Needs a new deploy.
- Or paste a full `https://` link to a photo hosted elsewhere into the sheet
  (no deploy needed). Google Drive "share" links do not work as image links.

The fabric tile images are colour-matched close-ups of the gold buta made for
the design; replace them with real fabric photos whenever you have them.

## Good to know

- WhatsApp orders go to the `whatsapp_number` in the sheet; the message includes
  the saree code, colour, website price and a link back to the saree.
- Customers can add the site to their home screen (it works like an app).
- Link previews on WhatsApp show the shop banner (`public/images/og-image.jpg`).
