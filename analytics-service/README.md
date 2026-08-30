# Trip & Analytics Microservices

Ova grana implementira dva ključna servisa u okviru arhitekture: **Trip Service** i **Analytics Service**.

## 1. Trip Service (Port 3003)
Zadužen za upravljanje planovima putovanja (CRUD) i stavkama unutar itinerera. Podaci se čuvaju u **MySQL** bazi podataka.
- **Rute:**
  - `POST /api/trips` - Kreiranje putovanja
  - `GET /api/trips/:id` - Detalji putovanja (IDOR zaštićeno)
  - `GET /api/trips/user/:userId` - Sva putovanja određenog korisnika
  - `PATCH /api/trips/:id` - Izmena putovanja (IDOR zaštićeno)
  - `DELETE /api/trips/:id` - Brisanje putovanja (IDOR zaštićeno)
  - `POST /api/trips/:id/items` - Dodavanje stavke u plan
  - `DELETE /api/trips/:id/items/:itemId` - Uklanjanje stavke iz plana
  - `GET /api/trips/:id/weather` - Vremenska prognoza preko OpenWeather API integracije
  - `GET /health` & `GET /metrics` - Monitoring i Prometheus metrike

## 2. Analytics Service (Port 3004)
Hibridni procesor koji asinhrono osluškuje izmene i generiše statističke izveštaje. Podaci se keširaju u **MongoDB** bazi podataka.
- **Rute:**
  - `GET /api/analytics/trip/:tripId` - Dobavljanje izračunatih statistika
  - `GET /health` & `GET /metrics` - Monitoring

## Kafka Komunikacija (Event-Driven)
Uspostavljeno je asinhrono slanje i konzumiranje poruka kroz sledeće topike:
- `trip-created` & `trip-updated` -> **Trip Service (Producer)** šalje događaje nakon uspešnog upisa u bazu, koje **Analytics Service (Consumer)** obrađuje.
- `analytics-generated` & `trip-processing-failed` -> **Analytics Service (Producer)** šalje ishode obrade, koje **Trip Service (Consumer)** hvata i ažurira status u bazi (`READY`/`FAILED`).