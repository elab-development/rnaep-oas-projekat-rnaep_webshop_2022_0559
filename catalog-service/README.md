# Catalog Service

Catalog Service je mikroservis zadužen za upravljanje katalogom destinacija, hotela, restorana i atrakcija.

## Environment variables

Primer `.env` fajla:

```env
PORT=3002
MONGO_URI=mongodb://mongo-catalog:27017/catalog_db
GEOAPIFY_API_KEY=change_me
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org