# DealHound — Black Friday deal finder

[![make.fun](https://img.shields.io/badge/make.fun-black--friday--deal--finder--01-92400e)](https://make.fun/c/black-friday-deal-finder-01)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A static deal-finder site for Black Friday and Cyber Monday 2026. Every deal
on the board is real: found and checked on **27 November 2026** by reading the
price at the named store or in a deals source that names the store.

## What it does

- **43 deals** across 9 categories (Audio, Laptops, TVs, Gaming, Smart home,
  Kitchen, Home, Toys, Wearables), from Amazon, Best Buy, Walmart, Target,
  Dell and Sam's Club.
- Each deal shows its product, store, link to the product at that store, sale
  price, usual price, discount, when its price was checked and where it was
  read.
- An **honest verdict** on every deal: *All-time low*, *Strong deal*,
  *Good deal* or *Routine sale* — with the evidence for the call.
- **Same-product comparison**: where another store sells the same product,
  the card and the detail page show that price too.
- **Search and filters that work**: live search, category chips, store,
  discount and verdict filters, and sorting by biggest discount, biggest
  dollar savings, price or name.
- Works on a desktop and on a phone; no build step, no network requests —
  the deals are data in `app/deals.js`.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.

## How the prices were checked

All 43 prices were read on 27 November 2026, 07:30 UTC, from the stores
themselves and from deal roundups that name the store (9to5Toys, 9to5Mac,
The Gadgeteer, AppleInsider, Popular Science, Koupon, GamesRadar, Siliconera,
CNN Underscored, Digital Citizen, MacObserver, Product Bible, PhillyVoice,
ShopLTK, Gadget Review, CapitalsWire, TechSpot). Each deal's card names its
source. Prices move during Black Friday week — the site tells shoppers to
confirm the price at the store before buying.

## License

MIT — see [LICENSE](LICENSE).
