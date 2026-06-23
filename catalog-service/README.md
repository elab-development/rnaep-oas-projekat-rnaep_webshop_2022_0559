# Catalog Service

Ovaj servis je zadužen za upravljanje katalogom proizvoda/stavki u okviru webshop aplikacije.

## Tehnologije
- **Node.js** / **Express**
- **MongoDB** (baza podataka)

## Podešavanje okruženja (Environment Variables)
Pre pokretanja servisa, kreiraj `.env` fajl u ovom folderu i dodaj sledeće varijable (isprati primer iz `.env.example`):
```text
PORT=3000
MONGO_URI=mongodb://localhost:27017/webshop